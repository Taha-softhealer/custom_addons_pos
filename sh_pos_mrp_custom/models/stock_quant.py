# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies

from odoo import _, api, models

class StockQuant(models.Model):
    _inherit="stock.quant"

    @api.model
    def action_view_inventory(self):
        """
            Override by Softhealer Technologies.

            The function overrides the parent method and modifies the action view
            based on a specific context('sh_qty_low_to_high').
            :return: The code is returning the action dictionary.
        """
        action = super().action_view_inventory()
        if action and self.env.context.get('sh_qty_low_to_high'):
            action['view_id'] = self.env.ref('sh_pos_mrp_custom.view_stock_quant_tree_inventory_editable_inherit').id
        return action
