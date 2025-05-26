from odoo import api, fields, models, tools


class PosSession(models.Model):
    _inherit = "pos.session"

    @api.model
    def _load_pos_data_models(self, config_id):
        record = super()._load_pos_data_models(config_id)
        record += [
            "sh.happy.hours",
            "sh.available.pack.pricelist.lines",
            "sh.get.one.product.free",
        ]
        return record


class PosOrderline(models.Model):
    _inherit = "pos.order.line"

    sh_free_pack_product = fields.Boolean()
    sh_free_pack_product_of_id = fields.Many2one(
        "product.product",
    )

    @api.model
    def _load_pos_data_fields(self, config_id):
        result = super()._load_pos_data_fields(config_id)
        result += ["sh_free_pack_product","sh_free_pack_product_of_id"]
        return result
