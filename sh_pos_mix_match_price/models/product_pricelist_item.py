# -*- coding: utf-8 -*-
# Part of Softhealer Technologies. See LICENSE file for full copyright and licensing details.
from odoo import api, fields, models


class ProductPricelistItem(models.Model):
    _inherit = "product.pricelist.item"

    sh_enable_mixmatch_pricelist = fields.Boolean("Enable Mix match pricelist")

    @api.model
    def _load_pos_data_fields(self, config_id):
        result=super()._load_pos_data_fields(config_id)
        result+=["sh_enable_mixmatch_pricelist"]
        return result
