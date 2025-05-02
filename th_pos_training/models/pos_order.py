from odoo import api, fields, models, tools


class PosOrder(models.Model):
    _inherit = "pos.order"
    
    sh_order_note= fields.Char("Order Note")