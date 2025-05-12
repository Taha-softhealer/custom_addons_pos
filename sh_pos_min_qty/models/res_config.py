from odoo import api, fields, models

class PosConfig(models.Model):
    _inherit = 'pos.config'

    sh_enable_pos_min_qty = fields.Boolean("Enable POS min Qty")

class ResConfigSettiongsInhert(models.TransientModel):
    _inherit = "res.config.settings"
    
    pos_enable_min_qty = fields.Boolean(related="pos_config_id.sh_enable_pos_min_qty",readonly=False)