# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.
from odoo import fields, models, api


class PosOrder(models.Model):
    _inherit = 'pos.order.line'

    sh_line_note  = fields.Char("note")

    @api.model
    def _load_pos_data_fields(self, config_id):
        return super()._load_pos_data_fields(config_id) + ["sh_line_note"]

class PosOrder(models.Model):
    _inherit = 'pos.order'


    sh_ordernote  = fields.Char("Order note") 