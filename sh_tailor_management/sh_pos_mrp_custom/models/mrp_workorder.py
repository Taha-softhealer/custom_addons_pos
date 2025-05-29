# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies

from odoo import _, api, fields, models

class MrpWorkorder(models.Model):
    _inherit="mrp.workorder"

    sh_mrp_employee_commission_line = fields.One2many("sh.mrp.employee.commission.line",'workorder_id', "Employee Commission line")

    @api.model_create_multi
    def create(self, vals_list):
        for values in vals_list:
            if values.get("operation_id",False):
                operation = self.env["mrp.routing.workcenter"].browse(values.get("operation_id",False))
                if operation.sh_mrp_employee_commission_line:
                    values.update({"sh_mrp_employee_commission_line": [(0,0,{"employee_id":com_line.employee_id.id,"commission_percentage":com_line.commission_percentage}) for com_line in operation.sh_mrp_employee_commission_line]})
        return super().create(vals_list)