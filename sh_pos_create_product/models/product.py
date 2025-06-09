from odoo import api, fields, models


class ProductProduct(models.Model):
    _inherit = "product.product"

    sh_on_hand_qty = fields.Integer(string="On hand Quantity")

    @api.model
    def create(self, values):
        result = super().create(values)
        if result.sh_on_hand_qty:
            Warehouse = self.env['stock.warehouse']
            warehouse = Warehouse.search([('company_id', '=', self.env.company.id)], limit=1)
            stock_location = warehouse.lot_stock_id if warehouse else None
            self.env["stock.quant"].create(
                {
                    "product_id": result.id,
                    "quantity": result.sh_on_hand_qty,
                    "location_id":stock_location.id
                }
            )

        return result
