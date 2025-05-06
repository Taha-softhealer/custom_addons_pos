# -*- coding: utf-8 -*-
# Part of Softhealer Technologies. See LICENSE file for full copyright and licensing details.

from odoo import fields, models, api

class sh_design_category(models.Model):
    _name = "sh.design.category"
    _description = "design category details"
    
    name = fields.Char(string="design category")
    design_type_ids=fields.One2many('sh.design.type',"design_category")


class ShMeasurement(models.Model):
    _inherit="sh.measurement"
    

    sh_design=fields.One2many("sh.design","sh_measurment")