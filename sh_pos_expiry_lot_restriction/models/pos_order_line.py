# -*- coding: utf-8 -*-
# Part of Softhealer Technologies. See LICENSE file for full copyright and licensing details.
from odoo import api, fields, models
from odoo.tools import float_compare


class PosOrderLine(models.Model):
    _inherit = "pos.order.line"

    @api.model
    def sh_get_existing_lots(self, company_id, product_id):
        """
        Return the lots that are still available in the given company.
        The lot is available if its quantity in the corresponding stock_quant and pos stock location is > 0.
        with expiry date
        """
        self.check_access("read")
        pos_config = self.env["pos.config"].browse(self._context.get("config_id"))
        if not pos_config:
            raise UserError(_("No PoS configuration found"))

        src_loc = pos_config.picking_type_id.default_location_src_id
        src_loc_quants = (
            self.sudo()
            .env["stock.quant"]
            .search(
                [
                    "|",
                    ("company_id", "=", False),
                    ("company_id", "=", company_id),
                    ("product_id", "=", product_id),
                ]
            )
        )
        available_lots = src_loc_quants.mapped("lot_id")
        print('\n\n\n-----available_lots------->',available_lots)
        return available_lots.read(["id", "name", "product_qty", "expiration_date"])
