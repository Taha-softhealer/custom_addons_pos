# -*- coding: utf-8 -*-
# Part of Softhealer Technologies. See LICENSE file for full copyright and licensing details.
from odoo import api, fields, models


class ShAvailablePackPricelistLines(models.Model):
    _name = "sh.available.pack.pricelist.lines"
    _description = "Sh Happy Hours Discount"
    
    name = fields.Char("Name")
    sh_product_id = fields.Many2one(
        "product.product",
        string="Product",
        required=True
    )
    sh_quantity = fields.Integer("Quantity",required=True,default="1")
    sh_pack_product_id = fields.Many2one(
        "product.product",
        string="Pack Product",
        required=True
    )

    sh_happy_hour_id = fields.Many2one(
        "sh.happy.hours",
        string="Happy hour",
    )

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

class ShGetOneProductFree(models.Model):
    _name = "sh.get.one.product.free"
    _description = "Sh get one product free"

    name = fields.Char("Name")
    sh_happy_hour_id = fields.Many2one(
        "sh.happy.hours",
        string="Happy hour",
    )
    sh_product_id = fields.Many2one(
        "product.product",
        string="Product",
        required=True
    )
    sh_quantity = fields.Integer("Quantity",required=True,default="1")

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