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
                    ("location_id", "in", src_loc.child_internal_location_ids.ids),
                ]
            )
        )
        available_lots = src_loc_quants.filtered(
            lambda q: float_compare(
                q.quantity, 0, precision_rounding=q.product_id.uom_id.rounding
            )
            > 0
        ).mapped("lot_id")

        return available_lots.read(["id", "name", "product_qty", "expiration_date"])
