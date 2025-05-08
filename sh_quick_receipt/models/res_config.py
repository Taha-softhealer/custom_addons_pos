from odoo import models, fields

class PosConfig(models.Model):
    _inherit = 'pos.config'
    
    sh_enable_order_receipt = fields.Boolean(string="Enable order receipt")

class ResConfigSettiongsInhert(models.TransientModel):
    _inherit = "res.config.settings"
    
    pos_enable_order_receipt = fields.Boolean(related="pos_config_id.sh_enable_order_receipt",readonly=False)
