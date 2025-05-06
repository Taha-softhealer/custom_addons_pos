# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies

from odoo import _, api, fields, models


class ShMrpEmployeeCommissionLine(models.Model):
    _name="sh.mrp.employee.commission.line"
    _description="Manufacturing employee Commission line"

    name = fields.Char(string="Employee Commission",compute="_compute_name", store=True,copy=False)
    workcenter_id = fields.Many2one("mrp.routing.workcenter",string="Work Center", ondelete="cascade")
    workorder_id = fields.Many2one("mrp.workorder",string="Work Order", ondelete="cascade")

    employee_id = fields.Many2one("hr.employee", "Employee", required=True)
    commission_percentage = fields.Float()

    @api.depends("employee_id","employee_id.name","commission_percentage")
    def _compute_name(self):
        for line in self:
            name = F"{line.employee_id and line.employee_id.name} {line.commission_percentage and F'- {line.commission_percentage}'}"
            line.name = name