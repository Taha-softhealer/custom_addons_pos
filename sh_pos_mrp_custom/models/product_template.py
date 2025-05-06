# Copyright (C) Softhealer Technologies.
from odoo import fields, models, api, _


class ProductTemplateInherit(models.Model):
    _inherit = 'product.template'

    sh_is_raw_materil = fields.Boolean(string="Is Raw Material ? ")
    sh_is_fabric = fields.Boolean(string="Is Fabric ?")
    sh_fabric_qty = fields.Float(string='Fabric Qty')