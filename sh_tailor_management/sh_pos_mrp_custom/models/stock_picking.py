# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies

from odoo import _, api, fields, models
from odoo.tools import float_is_zero
from odoo.exceptions import UserError, ValidationError

class StockPicking(models.Model):
    _inherit='stock.picking'

    state = fields.Selection(selection_add=[("partial_ready","Partially Ready"),("assigned",)])
    sh_mrp_to_pos_production_id = fields.Many2one("mrp.production","Production ID")
    is_sh_picking_default_state_waiting = fields.Boolean(default=True)

    @api.depends('pos_order_id')
    def _compute_state(self):
        picking_to_compute = self.env["stock.picking"]
        for picking in self:
            if picking.is_sh_picking_default_state_waiting and picking.pos_order_id.config_id.sh_enable_piking_state:
                picking.state="confirmed"

            else:
                picking_to_compute |= picking

        super(StockPicking,picking_to_compute)._compute_state()


    @api.model
    def _create_picking_from_pos_order_lines(self, location_dest_id, lines, picking_type, partner=False):
        """We'll create some picking based on order_lines"""

        pickings = self.env['stock.picking']
        stockable_lines = lines.filtered(lambda l: l.product_id.type in ['product', 'consu'] and not float_is_zero(l.qty, precision_rounding=l.product_id.uom_id.rounding))
        if not stockable_lines:
            return pickings
        positive_lines = stockable_lines.filtered(lambda l: l.qty > 0)
        negative_lines = stockable_lines - positive_lines
        is_mo = lines.filtered(lambda line: line.product_id.bom_ids)
        if positive_lines:
            location_id = picking_type.default_location_src_id.id
            positive_picking = self.env['stock.picking'].create(
                self._prepare_picking_vals(partner, picking_type, location_id, location_dest_id)
            )

            positive_picking._create_move_from_pos_order_lines(positive_lines)
            self.env.flush_all()
            if not lines.order_id.config_id.sh_enable_piking_state or not is_mo :
                try:
                    with self.env.cr.savepoint():
                        positive_picking.is_sh_picking_default_state_waiting = False
                        positive_picking._action_done()
                except (UserError, ValidationError):
                    pass

            pickings |= positive_picking
        if negative_lines:
            if picking_type.return_picking_type_id:
                return_picking_type = picking_type.return_picking_type_id
                return_location_id = return_picking_type.default_location_dest_id.id
            else:
                return_picking_type = picking_type
                return_location_id = picking_type.default_location_src_id.id

            negative_picking = self.env['stock.picking'].create(
                self._prepare_picking_vals(partner, return_picking_type, location_dest_id, return_location_id)
            )
            negative_picking._create_move_from_pos_order_lines(negative_lines)
            self.env.flush_all()
            if not lines.order_id.config_id.sh_enable_piking_state or not is_mo:
                try:
                    with self.env.cr.savepoint():
                        negative_picking.is_sh_picking_default_state_waiting = False

                        negative_picking._action_done()
                except (UserError, ValidationError):
                    pass
            pickings |= negative_picking
        return pickings
    
    def _action_done(self):
        res = super()._action_done()
        if res:
            for picking in self:
                production = picking.sh_mrp_to_pos_production_id
                waiting_transfer = production.sh_mrp_to_pos_internal_picking_line.filtered(lambda pick: pick.id != picking.id and pick.state=="waiting" )
                waiting_moves = waiting_transfer.move_ids.filtered(lambda move: move.state == 'waiting') if waiting_transfer else False
                if waiting_moves:
                    waiting_moves.state = "partially_available"

        return res