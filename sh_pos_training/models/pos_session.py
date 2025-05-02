# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.
from odoo import models, api


class PosSession(models.Model):
    _inherit = 'pos.session'

    @api.model
    def _load_pos_data_models(self, config_id):
        res = super()._load_pos_data_models(config_id)
        print("\n\n\n\n\\n\n\n res data models", res)
        res += ["pre.define.note"]
        return res