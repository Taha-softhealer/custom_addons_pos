# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.

from odoo import _, api, fields, models


class PosOrderLine(models.Model):
    _inherit = "pos.order.line"

    sh_component_ids = fields.One2many(
        "sh.pos.order.line.component", "sh_pos_order_line_id")
    sh_measurement_id = fields.Many2one("sh.measurement", string="Measurement")
    sh_measurement_line_ids = fields.One2many(
        "sh.pos.order.line.measurement", "sh_measurement_line_id", string="line Measurement")
    sh_is_fitting = fields.Boolean(string="Fitting ?")
    sh_production_line = fields.One2many(
        "mrp.production", "sh_pos_order_line_id", string="Productions")
    sh_production_id = fields.Many2one(
        "mrp.production", string="Current Production Production", ondelete="set null")
    sh_component_note = fields.Char(string="Production Order note")
    sh_measurement_note = fields.Char(string="measurement note")
    sh_production_state = fields.Char(
        string="Production State", compute="_compute_sh_production_state", store=True)
    is_sh_refund_approve = fields.Boolean()
    sh_parent_order_line_uuid = fields.Char(string="Parent Uuid", readonly=True, copy=False)
    sh_partner_id = fields.Many2one('res.partner',string="Customer")

    @api.depends("sh_production_id", "sh_production_id.state")
    def _compute_sh_production_state(self):
        for line in self:
            selection_dict = dict(
                self.env["mrp.production"]._fields["state"]._description_selection(self.env))
            production_state = selection_dict.get(
                line.sh_production_id.state) if line.sh_production_id.state in selection_dict else ""

            line.sh_production_state = production_state
            if line.sh_production_id:
                partners = self.env["pos.session"].get_active_sessions_user_partners()
                bus_detail_vals = {
                    "current_production_vals": line.sh_production_id.sudo().read()[0],
                    "pos_order_id": line.order_id.id,
                    "production_vals_list":line.sh_production_line.sudo().read(),
                    "pos_order_line_vals": line.order_id.lines.read()
                }

                notifications = [(partner, "sh_pos_line_current_production_update",
                                bus_detail_vals) for partner in partners]
                # if notifications:
                #     self.env["bus.bus"]._sendmany(notifications)

    @api.model
    def sh_search_line_data(self, domain=None, fields=None, offset=0, limit=None, order=None):
        result = self.search(domain)
        production_orders = result.sh_production_line.sudo().read(
            ["name", "display_name", "state"])
        return production_orders

    
    @api.model
    def _load_pos_data_fields(self, config_id):
        result = super()._load_pos_data_fields(config_id)
        result.extend(['sh_measurement_id',"sh_component_note", 'sh_component_ids', 'sh_measurement_line_ids', 'sh_production_id','sh_is_fitting', 'sh_production_state' ,"sh_partner_id"])
        return result
    
