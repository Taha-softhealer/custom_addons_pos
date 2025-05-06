# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies

from odoo import _, api, fields, models

class ShMeasurementCategory(models.Model):
    _name ="sh.measurement.category"
    _inherit="image.mixin"
    _description="Measurement Category"

    name = fields.Char(required=True)
    sh_measurement_line_ids = fields.Many2many('sh.measurement.type', 'sh_measurement_category_sh_measurement_type_rel', column1='sh_measurement_category_id', column2="sh_measurement_type_id", string="Measurement Categorys")
    sh_gender = fields.Selection([('man', 'Man'), ('woman', 'Woman')], string="Gender")


    def _load_pos_data(self, data):
        domain = []
        fields = []
        return {
            'data': self.search_read(domain, fields, load=False) if domain is not False else [],
            'fields': fields,
        }