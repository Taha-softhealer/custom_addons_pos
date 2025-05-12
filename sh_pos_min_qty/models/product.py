from odoo import api, fields, models

class ProductProduct(models.Model):
    _inherit = 'product.product'
    
    sh_min_qty = fields.Integer(string="Minimum Product Qty in POS")
    sh_res_user_ids = fields.Many2many('res.users',string="Allocate Sales Person")

    def _load_pos_data_fields(self, config_id):
        result=super()._load_pos_data_fields(config_id)
        result+=["sh_min_qty","sh_res_user_ids"]
        return result

