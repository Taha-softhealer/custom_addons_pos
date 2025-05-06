# -*- coding: utf-8 -*-
# Part of Softhealer Technologies. See LICENSE file for full copyright and licensing details.

from odoo import fields, models, api


class sh_design_type(models.Model):
    _name = "sh.design.type"
    _description = "design type details"

    name = fields.Char(string="design type")
    image = fields.Binary(string="design img")
    design_category = fields.Many2one("sh.design.category", string="design category")
