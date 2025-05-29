# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies

from odoo import fields, models


class ShStockQuantOrderpoint(models.Model):
    _name = "sh.stock.quant.orderpoint"
    _description = "Minimum Stock Quantity"

    product_tmpl_id = fields.Many2one(
        'product.template', related='product_id.product_tmpl_id')
    product_id = fields.Many2one(
        'product.product', 'Product',
        domain=("[('product_tmpl_id', '=', context.get('active_id', False))] if context.get('active_model') == 'product.template' else"
                " [('id', '=', context.get('default_product_id', False))] if context.get('default_product_id') else"
                " [('type', '=', 'product')]"),
        ondelete='cascade', required=True, check_company=True)

    orderpoint_id = fields.Many2one(
        'stock.warehouse.orderpoint', 'Orderpoint', copy=False, index='btree_not_null', ondelete="cascade")
    location_id = fields.Many2one('stock.location', 'Location',related='orderpoint_id.location_id')
    company_id = fields.Many2one('res.company', 'Company', related='orderpoint_id.company_id')
    qty_on_hand = fields.Float('On Hand', readonly=True, related='orderpoint_id.qty_on_hand', digits='Product Unit of Measure')
    qty_forecast = fields.Float('Forecast', digits='Product Unit of Measure')
    product_min_qty = fields.Float('Min Quantity', digits='Product Unit of Measure', related="orderpoint_id.product_min_qty")
