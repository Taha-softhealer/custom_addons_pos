# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields, api

class ShPosOrderLineComponent(models.Model):
    _name="sh.pos.order.line.component"
    _description="order line component details"


    sh_product_id = fields.Many2one('product.product', string="product")
    sh_product_qty = fields.Float(string="Quantity")
    sh_initial_qty = fields.Float(string="initial Quantity")
    sh_product_uom = fields.Many2one('uom.uom', string="UoM")
    sh_pos_order_line_id = fields.Many2one('pos.order.line', string="line")
    product_uom_category_id = fields.Many2one(comodel_name='uom.category', related='sh_product_uom.category_id',)

    # @api.model
    # def create(self,vals_list):
    #     res = super().create(vals_list)
    #     return res
    
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
