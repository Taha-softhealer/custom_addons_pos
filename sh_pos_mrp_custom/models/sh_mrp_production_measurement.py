# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies

from odoo import _, api, fields, models

class ShMrpProductionMeasurement(models.Model):
    _name="sh.mrp.production.measurement"
    _inherit = "sh.measurement.mixin"
    _description="Production Measurement"

    production_id = fields.Many2one("mrp.production",string="Production", ondelete="cascade")
    sh_measurement_type_id = fields.Many2one('sh.measurement.type',string="Measurement Type")

    def _load_pos_data(self, data):
        domain = []
        fields = []
        return {
            'data': self.search_read(domain, fields, load=False) if domain is not False else [],
            'fields': fields,
        }