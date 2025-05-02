from odoo import api, fields, models

class PosConfig(models.Model):
    _inherit = 'pos.config'

    enable_pos_receipt_logo = fields.Boolean()
    receipt_logo = fields.Binary()
    enable_pos_header_logo = fields.Boolean()
    header_logo = fields.Binary()