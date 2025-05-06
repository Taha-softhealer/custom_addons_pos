# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies

from odoo import _, api, fields, models, Command
from odoo.tools import float_round

class PosOrder(models.Model):
    _name = 'pos.order'
    _inherit = ['pos.order','portal.mixin']

    sh_mo_ids = fields.One2many(
        'mrp.production', 'sh_pos_order_id', string="Manufacturing Orders")
    sh_measurement_id = fields.Many2one('sh.measurement', string="Measurement")
    sh_modification_request_line = fields.One2many(
        "sh.modification.request", "pos_order_id", string="Modification Request")
    sh_is_mo_created = fields.Boolean(string="Is Mo created ?", default=False)
    sh_is_refund_approve = fields.Boolean(string="Refund Approve")
    sh_delivery_state = fields.Char(string="Delivery order", compute="_compute_picking_state", store=True)
    sh_production_count = fields.Integer(string="Production count", compute="_compute_sh_production_count")

    def read_pos_data(self, data, config_id):
        results = super().read_pos_data(data, config_id)
        paid_orders = self.filtered_domain([('state', 'in', ['paid', 'done', 'invoiced'])])

        sh_component_ids  = paid_orders.mapped('lines').filtered(lambda line: line.sh_component_ids)
        line_measurement = paid_orders.mapped('lines').filtered(lambda line: line.sh_measurement_line_ids)
        
        results['sh.pos.order.line.component'] = sh_component_ids.sh_component_ids.read([], load=False)
        results['sh.pos.order.line.measurement'] = line_measurement.sh_measurement_line_ids.read([], load=False)
        return results

   
    @api.depends('picking_ids', 'picking_ids.state')
    def _compute_picking_state(self):
        notifications = []
        for rec in self:
            if all(prod.state != 'done' for prod in rec.picking_ids):
                rec.sh_delivery_state = 'Waiting'
            elif all(prod.state == 'done' for prod in rec.picking_ids):
                rec.sh_delivery_state = 'Deliverd'
            elif any(prod.state == 'done' for prod in rec.picking_ids):
                rec.sh_delivery_state = 'Partially Deliverd'
            else:
                rec.sh_delivery_state = 'Draft'
            partners = self.env["pos.session"].get_active_sessions_user_partners()
            bus_detail_vals = {
                "delivery_state": rec.sh_delivery_state,
                "pos_order_id": rec.id,
            }
            notifications += [(partner, "sh_delivery_state_update",
                                bus_detail_vals) for partner in partners]
        # if notifications:
        #     for notification in notifications : 
        #         self.env["bus.bus"]._sendone(notifications)

    @api.depends("sh_mo_ids")
    def _compute_sh_production_count(self):
        for order in self:
            order.sh_production_count = len(order.sh_mo_ids)

    @api.model
    def _order_fields(self, ui_order):
        results = super()._order_fields(ui_order)
        # if ui_order.get('sh_measurement_id', False):
        #     results['sh_measurement_id'] = ui_order.get('sh_measurement_id', False)
        ui_order['sh_is_refund_approve'] = True

        return results
    
    def _export_for_ui(self, order):
        result = super(PosOrder, self)._export_for_ui(order)
        result['sh_is_refund_approve'] = order.sh_is_refund_approve or False
        return result
    
    # @api.model
    # def _process_order(self, order, draft, existing_order):
    #     order_id = super(PosOrder, self)._process_order(
    #         order, draft, existing_order)
    #     if order_id:
    #         order_obj = self.env['pos.order'].search([('id','=',order_id)])
    #         if order_obj.partner_id:
    #             if order_obj.partner_id.sh_measurement_ids:
    #                 order_obj.sh_measurement_id = order_obj.partner_id.sh_measurement_ids[-1]

    #     orderObj = self.browse(order_id)
    #     orderObj.sh_send_notification_to_size_man()
    #     return order_id
    
    def sh_send_notification_to_size_man(self):
        group = self.env.ref('sh_pos_mrp_custom.sh_size_man').users
        active_users = self.env["pos.session"].get_active_sessions_user_partners()
        notify_user = group.filtered(lambda x: x.partner_id in active_users)
        if notify_user:
            for user in notify_user:
                self.env['sh.user.push.notification'].create_user_notification(user, self.name, 'Please take Measurement', 'pos.order', self.id)


    @api.model
    def sh_search_order_data(self, domain=None, fields=None, offset=0, limit=None, order=None):
        result = []
        order = self.search(domain)
        if order:
            order_details = order.read()[0]
            order_lines = []
            for line in order.lines:
                line_dict = line.read()
                if line_dict:
                    # line_dict[0]['sh_production_orders'] = line.sh_production_line.sudo(
                    # ).read()
                    line_dict[0]['sh_production_orders'] = []

                    for sh_prod_mes_line in line.sh_production_line.sudo():
                        production = sh_prod_mes_line.read()
                        if production:
                            production[0]['sh_measurement_id'] = sh_prod_mes_line.sh_measurement_id.read(load=False)
                            production[0]['sh_mrp_production_measurement_line'] = sh_prod_mes_line.sh_mrp_production_measurement_line.read()
                            line_dict[0]['sh_production_orders'].append(production[0])

                    line_dict[0]['sh_component_ids'] = line.sh_component_ids.sudo(
                    ).read()
                    line_dict[0]['sh_measurement_line_ids'] = line.sh_measurement_line_ids.sudo(
                    ).read()
                order_lines.append(line_dict[0])
            order_details['lines'] = order_lines
            result.append(order_details)
        return result

    def _generate_pos_order_invoice(self):
        if self.partner_id:
            res = super()._generate_pos_order_invoice()
            self.pos_order_ready_to_manufacture()
        else:
            res = False
        return res

    def add_payment(self, data):
        res = super().add_payment(data)
        self.pos_order_ready_to_manufacture()
        return res

    def pos_order_ready_to_manufacture(self):
        for order in self:
            if not order.sh_is_mo_created and order.account_move and order.state == "invoiced":
                # ready_to_create_mo = False
                # account_move = order.account_move
                # if order.sh_order_type_id.pickup_from_other_branch:
                #     ready_to_create_mo = account_move.amount_total and account_move.amount_residual == 0
                # else:
                #     ready_to_create_mo = (
                #         account_move.amount_total * 50)/100 >= account_move.amount_residual

                # if ready_to_create_mo:
                order._generate_pos_order_mos()

    def _generate_pos_order_mos(self):
        for line in self.lines:
            if line.sh_component_ids and line.qty > 0:
                order = line.order_id
                location_dest = self.env['stock.location'].search(
                    [('usage', '=', 'production')], limit=1)
                production_vals_list = []
                move_raw_vals_cmd = []
                for component in line.sh_component_ids:
                    rounding = component.sh_product_uom.rounding
                    product_uom_qty = float_round(component.sh_product_qty/line.qty if line.sh_is_fitting and line.qty > 1 else component.sh_product_qty,precision_rounding=rounding)
                    move_raw_vals_cmd.append(Command.create({
                        'product_id': component.sh_product_id.id,
                        'location_dest_id': location_dest.id,
                        'product_uom_qty': product_uom_qty,
                        'product_uom': component.sh_product_uom.id,
                    }))

                sh_mrp_production_measurement_line_cmd = []
                for measurement_vals in line.sh_measurement_line_ids.read_measurement_vals_list(["sh_measurement_type_id", "category_id", 'employee_id'], load=False):
                    if "id" in measurement_vals:
                        del measurement_vals["id"]
                    sh_mrp_production_measurement_line_cmd.append(
                        (Command.create(measurement_vals)))

                production_vals_list.append({
                    "product_id": line.product_id.id,
                    "product_uom_id": line.product_uom_id.id,
                    "product_qty": 1 if line.sh_is_fitting and line.qty > 1 else line.qty,
                    "move_raw_ids": move_raw_vals_cmd,
                    "is_sh_fitting_required": line.sh_is_fitting,
                    "sh_pos_order_id": order.id,
                    "sh_pos_order_line_id": line.id,
                    "sh_measurement_id": order.sh_measurement_id.id,
                    "sh_mrp_production_measurement_line": sh_mrp_production_measurement_line_cmd,
                    'sh_measurement_note': line.sh_measurement_note,
                    'sh_component_note': line.sh_component_note,
                    "state": "draft",
                })
                productions = self.env['mrp.production'].sudo().create(    
                    production_vals_list)
                if productions:
                    line.sh_production_id = productions[0].id
                    order.sh_is_mo_created = True

    def sh_picking_done(self):
        all_mo_done = "done"
        for mo in self.sh_mo_ids:
            if mo.state != "done" and mo.state != "cancel":
                all_mo_done = "mo_not_confirm"
                return  {'all_mo_done': all_mo_done}
                
        if all_mo_done:
            if self.picking_ids:
                for picking in self.picking_ids:
                    if picking.state != "done":
                        picking.button_validate()
                    else:
                        all_mo_done = "pocking_done"
            else:
                all_mo_done = "pocking_not_created"

        bus_detail_vals = {
            "delivery_state": self.sh_delivery_state,
            "pos_order_id": self.id,
        }
        
        return {'all_mo_done': all_mo_done,'bus_detail_vals': bus_detail_vals}

    # EXTENDS portal portal.mixin
    def _compute_access_url(self):
        super()._compute_access_url()
        for order in self:
            order.access_url = '/my/pos/orders/%s' % (order.id)

    def action_open_productions(self):
        if len(self.sh_mo_ids) == 1:
            return {
                "type": "ir.actions.act_window",
                "res_model": "mrp.production",
                "views": [[False, "form"]],
                "res_id": self.sh_mo_ids.id
            }
        return {
            'name': _('Manufacturing Orders'),
            "type": "ir.actions.act_window",
            "res_model": "mrp.production",
            "views": [[False, "list"], [False, "form"]],
            "domain": [('sh_pos_order_id', 'in', self.ids)],
        }