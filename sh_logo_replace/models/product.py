from odoo import api, fields, models

class ProductProduct(models.Model):
    _inherit = 'product.product'

    def _load_pos_data_fields(self, config_id):
        result=super()._load_pos_data_fields(config_id)
        result+=["qty_available","virtual_available"]
        return result

