# -*- coding: utf-8 -*-
# Part of Softhealer Technologies. See LICENSE file for full copyright and licensing details.
from odoo import api, fields, models

class ShHappyHours(models.Model):
    _name = "sh.happy.hours"
    _description = "Sh Happy Hours Discount"

    name = fields.Char(string='Name')
    everyday = fields.Boolean(string="Everyday")
    starting_from = fields.Float("Time")
