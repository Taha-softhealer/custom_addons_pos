from odoo import models, fields

class PosConfig(models.Model):
    _inherit = 'pos.config'
    
    sh_enable_product_internal_ref = fields.Boolean(string="Enable Product Internal Referance")
    sh_enable_product_internal_ref_cart = fields.Boolean(string="Enable Product Internal Referance in Cart")
    sh_enable_product_internal_ref_receipt = fields.Boolean(string="Enable Product Internal Referance in Receipt")

class ResConfigSettiongsInhert(models.TransientModel):
    _inherit = "res.config.settings"
    
    pos_enable_product_internal_ref = fields.Boolean(related="pos_config_id.sh_enable_product_internal_ref",readonly=False)
    pos_enable_product_internal_ref_cart = fields.Boolean(related="pos_config_id.sh_enable_product_internal_ref_cart",readonly=False)
    pos_enable_product_internal_ref_receipt = fields.Boolean(related="pos_config_id.sh_enable_product_internal_ref_receipt",readonly=False)