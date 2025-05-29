# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies

from odoo import _, fields, models, Command, api
from odoo.exceptions import UserError
from odoo.tools import float_round


class MrpProduction(models.Model):
    _inherit = "mrp.production"

    sh_pos_order_id = fields.Many2one("pos.order", string="Pos Order")
    sh_pos_order_line_id = fields.Many2one(
        "pos.order.line", string="POS Order Line", readonly=True)

    state = fields.Selection(selection_add=[("modification", "Modification"), ("fitting", "Fitting"), (
        "fitting_not_ok", "Fitting not ok"), ("refund_approval", "Refund Approval")])

    last_state = fields.Selection(
        selection=lambda self: self.env["mrp.production"]._fields["state"]._description_selection(self.env), string="Last State")
    sh_modification_request_line = fields.One2many(
        "sh.modification.request", "production_id", string="Modification Request", copy=False)
    sh_old_production_id = fields.Many2one(
        "mrp.production", string="Old Production")

    sh_remaining_qty_parent_production_id = fields.Many2one(
        "mrp.production", string="Remaining Quantity Parent Production")
    sh_remaining_qty_production_line = fields.One2many(
        "mrp.production", "sh_remaining_qty_parent_production_id", string="Remaining Quantity Child Productions")

    sh_refund_order_id = fields.One2many(
        "sh.order.refund", "sh_mrp_order_id", string="Refund Order")

    sh_measurement_id = fields.Many2one("sh.measurement", string="Measurement")
    sh_measurement_modification_request_line = fields.One2many(
        "sh.measurement.modification.request", "production_id", string="Measurement Modification Request ", copy=False )
    sh_mrp_production_measurement_line = fields.One2many(
        "sh.mrp.production.measurement", "production_id", string="Production Measurement")

    sh_compute_line_data = fields.Boolean("213" , default="False")
    is_sh_fitting_required = fields.Boolean("Fitting", copy=False)
    is_sh_fitting_ok = fields.Boolean("Is Fitting OK", copy=False)
    is_sh_go_for_fitting = fields.Boolean("Is Go For fitting", copy=False)
    is_sh_modification = fields.Boolean("Is Modification Process", copy=False)

    is_sh_dependent_mo = fields.Boolean("On Hold", copy=False)

    sh_component_note = fields.Char(string="Production Order note")
    sh_measurement_note = fields.Char(string="Measurement note")
    sh_measurement_modification_note = fields.Char(string="Measurement note")
    sh_employee_id = fields.Many2one(
        'hr.employee', string="Employee", related="sh_measurement_id.employee_id")
    sh_refund_employee_id = fields.Many2one(
        'hr.employee', string="Refund Employee",)

    sh_mrp_to_pos_internal_picking_line = fields.One2many(
        "stock.picking", "sh_mrp_to_pos_production_id", "Internal Transfer MRP to POS Order")
    sh_mrp_to_pos_internal_picking_count = fields.Integer(
        compute="_compute_sh_mrp_to_pos_internal_picking_count")
    
    sh_designs = fields.One2many("sh.design","sh_production_order_id", related='sh_pos_order_line_id.sh_measurement_id.sh_design')

    @api.model
    def _load_pos_data_domain(self, data):
        return []
    
    @api.model
    def _load_pos_data_fields(self, config_id):
        return []
    
    def _load_pos_data(self, data):
        domain = self._load_pos_data_domain(data)
        fields = self._load_pos_data_fields(data['pos.config']['data'][0]['id'])
        return {
            'data': self.search_read(domain, fields, load=False) if domain is not False else [],
            'fields': fields,
        }

    @api.depends("sh_mrp_to_pos_internal_picking_line")
    def _compute_sh_mrp_to_pos_internal_picking_count(self):
        for production in self:
            production.sh_mrp_to_pos_internal_picking_count = len(
                production.sh_mrp_to_pos_internal_picking_line)

    @api.depends("is_sh_go_for_fitting", "is_sh_modification", "sh_pos_order_line_id.is_sh_refund_approve")
    def _compute_state(self):
        productions_to_compute = self.env["mrp.production"]
        for production in self:
            if production.sh_pos_order_line_id.is_sh_refund_approve:
                production.state = "cancel"
            elif production.is_sh_modification:
                production.state = "modification"
            elif production.is_sh_go_for_fitting and not production.is_sh_fitting_ok and production.is_sh_fitting_required and all(move.state in ('cancel', 'done') for move in production.move_finished_ids):
                production.state = "fitting"
            elif production.state not in ("refund_approval", "fitting_not_ok"):
                productions_to_compute |= production
        super(MrpProduction, productions_to_compute)._compute_state()

    @api.model_create_multi
    def create(self, vals_list):
        productions = super().create(vals_list)
        for production in productions:
            if not production.sh_pos_order_line_id:
                continue
            if production.sh_pos_order_line_id.sh_parent_order_line_uuid:
                production.is_sh_dependent_mo = True

            if production.sh_old_production_id and production.state == "confirmed":
                production.sh_pos_order_line_id.sh_production_id = production
        return productions

    def write(self, vals):
        if "state" in vals:
            if self[:1].state == 'fitting_not_ok':
                vals.update({"last_state": "modification", 'state': "modification"})
            else:
                vals.update({"last_state": self[:1].state})
        res = super().write(vals)
        for production in self:
            if production.sh_pos_order_line_id:
                if production.state == "modification" and production.last_state=="done":
                    (production | production.sh_remaining_qty_production_line | production.sh_remaining_qty_parent_production_id).create_branch_to_manufacturing_returns()
                    
                current_production = production.sh_pos_order_line_id.sh_production_line.filtered(
                    lambda production: production.state != "cancel").sorted(key="create_date", reverse=True)[:1]
                if current_production:
                    production.sh_pos_order_line_id.sh_production_id = current_production
        return res

    def action_mrp_to_pos_internal_pickings(self):
        if len(self.sh_mrp_to_pos_internal_picking_line) == 1:
            return {
                "type": "ir.actions.act_window",
                "res_model": "stock.picking",
                "views": [[False, "form"]],
                "res_id": self.sh_mrp_to_pos_internal_picking_line.id
            }
        return {
            'name': _('Transfers'),
            "type": "ir.actions.act_window",
            "res_model": "stock.picking",
            "views": [[False, "list"], [False, "form"]],
            "domain": [('id', 'in', self.sh_mrp_to_pos_internal_picking_line.ids)],
        }

    def action_modification_approve(self):
        """
            Method of Softhealer Technologies.

            The function approves modification requests for productions and
            creates new productions with modified values.
        """
        if self.env.user.has_group("mrp.group_mrp_manager"):
            production_vals_list = []
            for production in self:
                if production.state == "modification":
                    # if not production.sh_modification_request_line:
                    #     raise UserError(
                    #         _(F"No moderation request to approve for {production.name}"))

                    copied_vals_list = production.copy_data()
                    if copied_vals_list and production.sh_pos_order_line_id:
                        line = production.sh_pos_order_line_id
                        source_location = production.location_src_id
                        copied_vals = copied_vals_list[0]
                        copied_vals.update({
                            "state": "draft",
                            "sh_old_production_id": production.id,
                            "is_sh_fitting_required": production.is_sh_fitting_required
                        })
                        sequence = 10
                        move_raw_vals_cmd = []
                        if production.sh_modification_request_line:
                            for mr in production.sh_modification_request_line:
                                product = mr.modified_product_id
                                rounding = mr.product_uom.rounding
                                product_uom_qty = float_round(
                                    mr.product_qty/line.qty if production.is_sh_fitting_required and line.qty > 1 else mr.product_qty, precision_rounding=rounding)

                                date_start = production._get_default_date_start()

                                # Modification Request line.
                                move_raw_vals_cmd.append(Command.create({
                                    "sequence": sequence,
                                    "name": _("New"),
                                    "date": date_start,
                                    "date_deadline": date_start,
                                    "picking_type_id": production.picking_type_id.id,
                                    "product_id": product.id,
                                    "product_uom_qty": product_uom_qty,
                                    "product_uom": mr.product_uom.id,
                                    "location_id": source_location.id,
                                    "location_dest_id": production.product_id.with_company(self.company_id).property_stock_production.id,
                                    "raw_material_production_id": production.id,
                                    "company_id": production.company_id.id,
                                    "price_unit": product.standard_price,
                                    "procure_method": "make_to_stock",
                                    "origin": production._get_origin(),
                                    "state": "draft",
                                    "warehouse_id": source_location.warehouse_id.id,
                                    "group_id": production.procurement_group_id.id,
                                    "propagate_cancel": production.propagate_cancel,

                                }))
                                sequence += 1
                            sh_mrp_production_measurement_line_cmd = []
                        else:
                            for mr in production.move_raw_ids:
                                product = mr.product_id
                                rounding = mr.product_uom.rounding
                                product_uom_qty = float_round(
                                    mr.product_qty/line.qty if production.is_sh_fitting_required and line.qty > 1 else mr.product_qty, precision_rounding=rounding)

                                date_start = production._get_default_date_start()

                                # Modification Request line.
                                move_raw_vals_cmd.append(Command.create({
                                    "sequence": sequence,
                                    "name": _("New"),
                                    "date": date_start,
                                    "date_deadline": date_start,
                                    "picking_type_id": production.picking_type_id.id,
                                    "product_id": product.id,
                                    "product_uom_qty": product_uom_qty,
                                    "product_uom": mr.product_uom.id,
                                    "location_id": source_location.id,
                                    "location_dest_id": production.product_id.with_company(self.company_id).property_stock_production.id,
                                    "raw_material_production_id": production.id,
                                    "company_id": production.company_id.id,
                                    "price_unit": product.standard_price,
                                    "procure_method": "make_to_stock",
                                    "origin": production._get_origin(),
                                    "state": "draft",
                                    "warehouse_id": source_location.warehouse_id.id,
                                    "group_id": production.procurement_group_id.id,
                                    "propagate_cancel": production.propagate_cancel,

                                }))
                                sequence += 1
                            sh_mrp_production_measurement_line_cmd = []
                        for measurement_vals in production.sh_measurement_modification_request_line.read_measurement_vals_list(["sh_measurement_type_id", 'category_id', 'employee_id'], load=False):
                            if "id" in measurement_vals:
                                del measurement_vals["id"]
                            sh_mrp_production_measurement_line_cmd.append(
                                (Command.create(measurement_vals)))

                        copied_vals.update({"move_raw_ids": move_raw_vals_cmd,
                                            "product_qty": 1 if production.is_sh_fitting_required else production.product_uom_qty,
                                            "sh_mrp_production_measurement_line": sh_mrp_production_measurement_line_cmd})
                        if "move_finished_ids" in copied_vals:
                            del copied_vals["move_finished_ids"]
                        production_vals_list.append(copied_vals)

                    # Cancel old MO
                    production.is_sh_go_for_fitting = False
                    production.is_sh_modification = False
                    production.move_finished_ids.write({'state':'cancel'})
                    print("\n\n\n\n\n\n\n\n\n\n order ---->", production.sh_pos_order_id ,production.sh_pos_order_id.name)
                    print("\n\n\n\n\n\n\n\n\n\n config ---->", production.sh_pos_order_id.config_id , production.sh_pos_order_id.config_id.name)
                    production.sh_pos_order_id.config_id._notify(('Update_MO_state', {'id': production.sh_pos_order_line_id.id}))
 
            if production_vals_list:
                productions = self.create(production_vals_list)
                productions.with_context({'skip_check_dependencies_production': True}).action_confirm()
                if len(productions) == 1:
                    action = self.env["ir.actions.actions"]._for_xml_id(
                        "mrp.action_mrp_production_form")
                    action["res_id"] = productions.id
                    return action

                else:
                    action = self.env["ir.actions.actions"]._for_xml_id(
                        "mrp.mrp_production_action")
                    action["domain"] = [("id", "in", productions.ids)]

                    return action

    def action_modification_reject(self):
        """
        The function reverts the state of productions that are in the
        "modification" state to their previous state.
        """
        if self.env.user.has_group("mrp.group_mrp_manager"):
            for production in self:
                if production.state == "modification" and production.last_state:
                    if production.sh_pos_order_line_id:
                        component_create_cmd = [Command.clear()]
                        for move_raw in production.move_raw_ids:
                            sh_product_qty = round(
                                move_raw.product_uom_qty*production.sh_pos_order_line_id.qty if production.is_sh_fitting_required else move_raw.product_uom_qty)
                            component_create_cmd.append(Command.create({
                                "sh_product_id": move_raw.product_id.id,
                                "sh_product_qty": sh_product_qty,
                                "sh_product_uom": move_raw.product_uom.id,
                            }))

                        measurement_create_cmd = [Command.clear()]
                        for measurement_vals in production.sh_mrp_production_measurement_line.read_measurement_vals_list(["sh_measurement_type_id", "category_id", 'employee_id'], load=False):
                            if "id" in measurement_vals:
                                del measurement_vals["id"]
                            measurement_create_cmd.append(
                                (Command.create(measurement_vals)))
                        production.sh_pos_order_line_id.write({
                            "sh_measurement_line_ids": measurement_create_cmd,
                            "sh_component_ids": component_create_cmd
                        })
                    production.state = production.last_state
                    production.is_sh_modification = False
                    production.sh_modification_request_line.unlink()
                    production.sh_measurement_modification_request_line.unlink()

    @api.model
    def sh_search_read(self, domain=None, fields=None, offset=0, limit=None, order=None):
        result = self.search_read(domain)
        for res in result:
            res["move_raw_ids"] = self.env["stock.move"].sudo().search_read(
                [("id", "in", res.get("move_raw_ids"))])
        return result

    def _sh_check_dependencies_production(self):
        if self.env.context.get("skip_check_dependencies_production"):
            return
        
        for production in self:
            if production.is_sh_dependent_mo or production.sh_pos_order_line_id.sh_parent_order_line_uuid:
                uuid = production.sh_pos_order_line_id.sh_parent_order_line_uuid
                line = production.sh_pos_order_id.lines.filtered(lambda line: line.uuid==uuid)[:1]
                line_qty = 1 if line.sh_is_fitting else line.qty
                productions = line.sh_production_line.filtered(lambda prod: prod.state == 'done')
                produced_qty = sum(productions.mapped("qty_produced"))
                if produced_qty < line_qty:
                    raise UserError(_(F"Please first complete production of {line.product_id.display_name} dependency products"))
                
    def action_confirm(self):
        for mo in self:
            data = mo.read(load=False)
            print('\n\n\n\ mo.sh_pos_order_id', mo.sh_pos_order_id)
            if mo.sh_pos_order_id:
                mo.sh_pos_order_id.config_id._notify('SH_MO_CONFIRM', data)
            mo.sh_pos_order_id.config_id._notify(('Update_MO_state', {'id': mo.sh_pos_order_line_id.id}))
        self._sh_check_dependencies_production()
        return super().action_confirm()
    
    def pre_button_mark_done(self):
        self._sh_check_dependencies_production()
        return super().pre_button_mark_done()
    
    def button_mark_done(self):
        res = self.pre_button_mark_done()
        if res is not True:
            return res
        productions_to_mark_done = self.env["mrp.production"]
        for production in self:
            if not production.is_sh_fitting_required or production.is_sh_fitting_ok or not production.is_sh_go_for_fitting:
                productions_to_mark_done |= production
            else:
                production.state = "fitting"

        res = super(MrpProduction, productions_to_mark_done).button_mark_done()
        for production in self:
            production.sh_pos_order_id.config_id._notify(('Update_MO_state', {'id': production.sh_pos_order_line_id.id}))
        if res:
            productions_to_mark_done.create_internal_transfer_for_pos_orders()
        return res

    def action_refund_approve(self):
        if self.env.user.has_group("mrp.group_mrp_manager"):
            notifications = []
            partners = self.env["pos.session"].get_active_sessions_user_partners(
            )
            for production in self:
                pos_order = production.sh_pos_order_id
                pos_order.sh_is_refund_approve = True
                production.sh_pos_order_line_id.is_sh_refund_approve = True
                
                if pos_order and pos_order.account_move:
                    # Cancel MOS
                    productions = production | production.sh_remaining_qty_parent_production_id | production.sh_remaining_qty_production_line
                    productions.action_cancel()
                    bus_detail_vals = {
                        "current_production_vals": production.sudo().read()[0],
                        "pos_order_id": production.sh_pos_order_id.id,
                        "pos_order_line_vals": production.sh_pos_order_line_id.order_id.lines.sudo().read()[0],
                        "production_vals_list": production.sh_pos_order_line_id.sh_production_line.sudo().read(),
                    }
                    notifications += [(partner, "sh_production_refund_approved",
                                       bus_detail_vals) for partner in partners]
                    print("\n\n\n\n\n\n\n\n\n\n order ---->", production.sh_pos_order_id ,production.sh_pos_order_id.name)
                    print("\n\n\n\n\n\n\n\n\n\n config ---->", production.sh_pos_order_id.config_id , production.sh_pos_order_id.config_id.name)
                    # production.sh_pos_order_id.config_id._notify(('Update_MO_state', {'id': production.sh_pos_order_line_id.id}))
                    
            # if notifications:
            #     self.env["bus.bus"]._sendmany(notifications)

    def action_refund_reject(self):
        if self.env.user.has_group("mrp.group_mrp_manager"):
            notifications = []
            partners = self.env["pos.session"].get_active_sessions_user_partners(
            )
            for production in self:
                if production.state == "refund_approval" and production.last_state:
                    production.state = production.last_state
                    bus_detail_vals = {
                        "current_production_vals": production.sudo().read()[0],
                        "pos_order_id": production.sh_pos_order_id.id,
                        "pos_order_line_vals": production.sh_pos_order_line_id.order_id.lines.sudo().read(),
                        "production_vals_list": production.sh_pos_order_line_id.sh_production_line.sudo().read(),
                    }
                    notifications += [(partner, "sh_production_refund_rejected",
                                       bus_detail_vals) for partner in partners]
                    # production.sh_pos_order_id.config_id._notify(('Update_MO_state', {'id': production.sh_pos_order_line_id.id}))

            # if notifications:
            #     self.env["bus.bus"]._sendmany(notifications)

    def sh_fitting_ok(self):
        self_sudo = self.sudo()
        if self_sudo.is_sh_fitting_required and self_sudo.sh_pos_order_line_id:
            line = self_sudo.sh_pos_order_line_id
            copied_vals_list = self_sudo.copy_data() if line.qty > 1 else None
            if copied_vals_list:
                copied_vals = copied_vals_list[0]
                move_raw_vals_cmd = []
                sequence = 10

                for move_raw in self_sudo.move_raw_ids:
                    product_uom_qty = move_raw.product_uom_qty*line.qty - move_raw.product_uom_qty
                    date_start = self_sudo._get_default_date_start()

                    # Modification Request line.
                    move_raw_vals_cmd.append(Command.create({
                        "sequence": sequence,
                        "name": _("New"),
                        "product_id": move_raw.product_id.id,
                        "date": date_start,
                        "date_deadline": date_start,
                        "product_uom_qty": product_uom_qty,
                        "procure_method": "make_to_stock",
                        "state": "draft",
                        "product_uom": move_raw.product_uom.id,
                        "location_id": move_raw.location_id.id,
                        "location_dest_id": move_raw.location_dest_id.id,
                        "raw_material_production_id": move_raw.raw_material_production_id.id,
                        "price_unit": move_raw.price_unit,
                        "warehouse_id": move_raw.warehouse_id.id,
                    }))
                    sequence += 1

                sh_mrp_production_measurement_line_cmd = []
                for measurement_vals in self_sudo.sh_mrp_production_measurement_line.read_measurement_vals_list(["sh_measurement_type_id", "category_id", 'employee_id'], load=False):
                    if "id" in measurement_vals:
                        del measurement_vals["id"]
                    sh_mrp_production_measurement_line_cmd.append(
                        (Command.create(measurement_vals)))

                copied_vals.update({"move_raw_ids": move_raw_vals_cmd,
                                    "product_qty": line.qty - 1,
                                    "sh_remaining_qty_parent_production_id": self_sudo.id,
                                    "sh_mrp_production_measurement_line": sh_mrp_production_measurement_line_cmd})
                if "move_finished_ids" in copied_vals:
                    del copied_vals["move_finished_ids"]

                self_sudo.create(copied_vals)
            self_sudo.is_sh_fitting_ok = True
            self_sudo.is_sh_go_for_fitting = False
            self_sudo.is_sh_modification = False
            self_sudo.button_mark_done()

    def sh_fitting_not_ok(self):
        self.is_sh_go_for_fitting = False
        self.is_sh_modification = True
        self.state = "fitting_not_ok"
        self.sh_pos_order_id.config_id._notify(('Update_MO_state', {'id': self.sh_pos_order_line_id.id}))
        self.create_branch_to_manufacturing_returns()
        self.last_state = "modification"

    def create_branch_to_manufacturing_returns(self):
        transfers = self.sh_mrp_to_pos_internal_picking_line.filtered(lambda pick:pick.state=="done" and not pick.return_ids and not pick.return_id)

        transient_location = self.sh_pos_order_id.config_id.sh_transient_location_id
        for transfer in transfers:
            wizard = self.env['stock.return.picking'].with_context(active_id=transfer.id, active_model='stock.picking').create({'picking_id':transfer.id})
            return_id, _pick_type_id = wizard._create_returns()
            return_transfer = self.env["stock.picking"].browse(return_id)
            if return_transfer and transient_location:
                if return_transfer.location_dest_id.id == transient_location.id and return_transfer.location_id.id != transient_location.id:
                    return_transfer.move_ids.state = "partially_available"
                    for move in return_transfer.move_ids:
                        move.quantity = move.product_uom_qty



    def create_internal_transfer_for_pos_orders(self):
        """
        The function creates internal transfers for point of sale orders that are associated with a
        production and have finished moves.
        """
        internal_transfer_to_done = self.env["stock.picking"]
        for production in self:

            if production.sh_pos_order_id and production.move_finished_ids and production.state == "done":
                if production.is_sh_fitting_required and production.is_sh_fitting_ok:
                    continue

                production.is_sh_go_for_fitting = production.is_sh_fitting_required
                production.is_sh_modification = False

                pos_order = production.sh_pos_order_id
                if pos_order.sh_order_type_id and pos_order.sh_order_type_id.pickup_from_other_branch or (pos_order.sh_order_type_id and not pos_order.sh_order_type_id.is_home_delivery):
                    dest_location = pos_order.pick_up_order_from.picking_type_id.default_location_src_id if pos_order.sh_order_type_id.pickup_from_other_branch else pos_order.config_id.picking_type_id.default_location_src_id
                    if dest_location:
                        for move in production.move_finished_ids:
                            src_location = move.location_dest_id
                            picking_type = self.env['stock.picking.type'].search(
                                [('code', '=', 'internal'), ('warehouse_id', '=', src_location.warehouse_id.id)], limit=1)
                            if picking_type and (move.is_done or move.state == 'done') and src_location.id != dest_location.id:
                                picking_vals_list = []
                                picking_vals = {"sh_mrp_to_pos_production_id": production.id,
                                                "location_id": src_location.id,
                                                "location_dest_id": dest_location.id,
                                                "company_id": production.company_id.id,
                                                "state": "draft",
                                                "origin": F"Internal Transfer:{production.name}->{pos_order.name}",
                                                "picking_type_id": picking_type.id,
                                                "move_ids": [(0, 0, {"name": final_move.product_id.name,
                                                                     "product_id": final_move.product_id.id,
                                                                     "product_uom_qty": final_move.product_uom_qty,
                                                                     "location_id": src_location.id,
                                                                     "location_dest_id": dest_location.id, }) for final_move in production.move_finished_ids]}
                                transient_location = pos_order.config_id.sh_transient_location_id
                                if transient_location and transient_location.id != dest_location.id:
                                    src_to_trans = picking_vals.copy()
                                    src_to_trans.update({
                                        "location_dest_id": transient_location.id,
                                        "move_ids": [(0, 0, {"name": final_move.product_id.name,
                                                             "state": "partially_available",
                                                             "product_id": final_move.product_id.id,
                                                             "product_uom_qty": final_move.product_uom_qty,
                                                             "location_id": src_location.id,
                                                             "location_dest_id": transient_location.id, }) for final_move in production.move_finished_ids]
                                    })
                                    
                                    picking_type = self.env['stock.picking.type'].search(
                                    [('code', '=', 'internal'), ('warehouse_id', '=', dest_location.warehouse_id.id)], limit=1)
                                    trans_to_dest = picking_vals.copy()
                                    picking_type_id = picking_type.id or trans_to_dest.get("picking_type_id")
                                    trans_to_dest.update({
                                        "state":"waiting",
                                        "location_id": transient_location.id,
                                        "picking_type_id":picking_type_id,
                                        "move_ids": [(0, 0, {"name": final_move.product_id.name,
                                                             "product_id": final_move.product_id.id,
                                                             "product_uom_qty": final_move.product_uom_qty,
                                                             "location_id": transient_location.id,
                                                             "state": "waiting",
                                                             "location_dest_id": dest_location.id, }) for final_move in production.move_finished_ids]
                                    })
                                    
                                    picking_vals_list = [src_to_trans,trans_to_dest]
                                    
                                else:
                                    picking_vals_list.append(picking_vals)

                                if picking_vals_list:
                                    internal_transfer_to_done |= self.env["stock.picking"].with_company(
                                        production.company_id).create(picking_vals_list)

                        pos_order.picking_ids.filtered(lambda picking: picking.state != "done" and picking.location_id.usage ==
                                                       "internal" and picking.location_id.id != dest_location.id).location_id = dest_location

                elif pos_order.sh_order_type_id.is_home_delivery and len(production.move_finished_ids.location_dest_id) == 1:
                    location = production.move_finished_ids.location_dest_id
                    pos_order.picking_ids.filtered(lambda picking: picking.state != "done" and picking.location_id.usage ==
                                                   "internal" and picking.location_id.id != location.id).location_id = location

                state = "assigned" if all(prod.state in (
                    'done', 'cancel') for prod in pos_order.sh_mo_ids) else "partial_ready"
                pos_order.picking_ids.filtered(lambda picking: picking.state != "done" and picking.location_id.usage == "internal").write({
                    "state": state,
                    "is_sh_picking_default_state_waiting": False
                })

                qty_produced = production.qty_produced
                for move in pos_order.picking_ids.move_ids:
                    if move.state in ("done", "cancel"):
                        continue
                    if move.product_id.id == production.product_id.id:
                        quantity = move.quantity
                        if quantity <= qty_produced:
                            move.quantity = quantity if quantity == qty_produced else quantity + qty_produced
                            qty_produced -= quantity
                        else:
                            move.quantity = qty_produced

        # if internal_transfer_to_done:
        #     internal_transfer_to_done.button_validate()
