# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies

from odoo import api, fields, models
from odoo.tools import float_compare


class StockWarehouseOrderpoint(models.Model):
    _inherit = "stock.warehouse.orderpoint"

    sh_stock_quant_orderpoint_id = fields.Many2one(
        "sh.stock.quant.orderpoint", compute="_compute_sh_stock_quant_orderpoint_id", store=True)

    @api.depends('qty_forecast', 'product_min_qty', 'product_max_qty', 'visibility_days')
    def _compute_sh_stock_quant_orderpoint_id(self):
        """
            The function calculates the low stock quantity order point based on the forecasted quantity, minimum
            quantity, maximum quantity, and visibility days.
        """
        for orderpoint in self:
            stock_quant_orderpoint = orderpoint.sh_stock_quant_orderpoint_id
            if not orderpoint.product_id or not orderpoint.location_id:
                stock_quant_orderpoint.orderpoint_id = False
                orderpoint.sh_stock_quant_orderpoint_id = False
                continue

            rounding = orderpoint.product_uom.rounding
            if float_compare(orderpoint.qty_forecast, orderpoint.product_min_qty, precision_rounding=rounding) < 0:
                if not stock_quant_orderpoint:
                    stock_quant_orderpoint = stock_quant_orderpoint.create(
                        {"orderpoint_id": orderpoint.id, "product_id": orderpoint.product_id.id,"qty_forecast":orderpoint.qty_forecast})
                else:
                    stock_quant_orderpoint.orderpoint_id = orderpoint
                    stock_quant_orderpoint.update({"qty_forecast":orderpoint.qty_forecast})
            else:
                stock_quant_orderpoint.orderpoint_id = False

            orderpoint.sh_stock_quant_orderpoint_id = stock_quant_orderpoint

    def _procure_orderpoint_confirm(self, use_new_cursor=False, company_id=None, raise_user_error=True):
        """
            Override By Softhealer Technologies.
            To Prevent generating Purchase Orders. 
        """
        if True:
            return {}
        
        return super()._procure_orderpoint_confirm(use_new_cursor=use_new_cursor,company_id=company_id,raise_user_error=raise_user_error)