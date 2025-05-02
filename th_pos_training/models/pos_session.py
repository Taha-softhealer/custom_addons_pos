from odoo import api, fields, models, tools


class PosSession(models.Model):
    _inherit = "pos.session"

    @api.model
    def _load_pos_data_models(self,config_id):
        record = super()._load_pos_data_models(config_id)
        record += ["sh.order.note"]
        return record
