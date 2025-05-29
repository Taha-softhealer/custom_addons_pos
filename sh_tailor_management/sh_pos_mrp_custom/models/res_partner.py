# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields, api

class PartnerInherit(models.Model):
    _inherit = "res.partner"

    sh_measurement_ids = fields.One2many('sh.measurement', 'sh_partner_id', string="Measurement")

    @api.model
    def _load_pos_data_fields(self, config_id):
        return super()._load_pos_data_fields(config_id) + ["sh_measurement_ids"]
