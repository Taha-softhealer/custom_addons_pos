# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies

from odoo import _, api, fields, models

class MrpRoutingWorkCenter(models.Model):
    _inherit="mrp.routing.workcenter"

    sh_mrp_employee_commission_line = fields.One2many("sh.mrp.employee.commission.line",'workcenter_id', "Employee Commission line")