from odoo import api, fields, models, tools


class PosOrderLine(models.Model):
    _inherit = "pos.order.line"
    
    sh_order_note= fields.Char("Order Note")
    
    def _load_pos_data_fields(self, config_id):
        record=super()._load_pos_data_fields(config_id)
        record+=["sh_order_note"]
        return record