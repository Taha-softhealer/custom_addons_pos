from odoo import api, fields, models

class ProductProduct(models.Model):
    _inherit = 'product.product'
    
    sh_min_price = fields.Float(string="Minimum sale Price")
    sh_max_price = fields.Float(string="Maximum sale Price")
    

    def _load_pos_data_fields(self, config_id):
        result=super()._load_pos_data_fields(config_id)
        result+=["sh_min_price","sh_max_price"]
        return result

