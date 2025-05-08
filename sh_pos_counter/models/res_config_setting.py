from odoo import models, fields

class PosConfig(models.Model):
    _inherit = 'pos.config'
    
    sh_enable_total_item = fields.Boolean(string="Enable Total Item Counter")
    sh_enable_total_item_receipt = fields.Boolean(string="Display Total Item Counter in POS Order Receipt")
    sh_enable_total_qty = fields.Boolean(string="Enable Total Qty Counter")
    sh_enable_total_qty_receipt = fields.Boolean(string="Display Total Qty Counter in POS Order Receipt")

class ResConfigSettiongsInhert(models.TransientModel):
    _inherit = "res.config.settings"
    
    pos_enable_total_item = fields.Boolean(related="pos_config_id.sh_enable_total_item",readonly=False)
    pos_enable_total_item_receipt = fields.Boolean(related="pos_config_id.sh_enable_total_item_receipt",readonly=False)
    pos_enable_total_qty = fields.Boolean(related="pos_config_id.sh_enable_total_qty",readonly=False)
    pos_enable_total_qty_receipt = fields.Boolean(related="pos_config_id.sh_enable_total_qty_receipt",readonly=False)
