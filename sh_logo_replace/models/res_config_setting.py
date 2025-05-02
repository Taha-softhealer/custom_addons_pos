from odoo import api, fields, models

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    pos_enable_pos_receipt_logo = fields.Boolean(related="pos_config_id.enable_pos_receipt_logo",readonly=False)
    pos_receipt_logo = fields.Binary(related="pos_config_id.receipt_logo",readonly=False)
    pos_enable_pos_header_logo = fields.Boolean(related="pos_config_id.enable_pos_header_logo",readonly=False)
    pos_header_logo = fields.Binary(related="pos_config_id.header_logo",readonly=False)