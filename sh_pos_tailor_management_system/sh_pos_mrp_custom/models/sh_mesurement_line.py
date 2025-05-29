# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields, api

class ShMeasurementLine(models.Model):
    _name = "sh.measurement.line"
    _inherit = "sh.measurement.mixin"
    _description="measurement lines "
    _rec_name="category_id"

    sh_measurement_type_id = fields.Many2one('sh.measurement.type',string="Measurement Type")
    sh_measurement_id = fields.Many2one("sh.measurement", string="Measurement")
    sh_enter_size_length = fields.Integer('Size Length', related="sh_measurement_type_id.sh_enter_size_length")
    sh_uom_id_reated = fields.Many2many('uom.uom', related="sh_measurement_type_id.type_uom_ids" )

    def sh_unlink_line(self):
        measurement_id = self.sh_measurement_id.id
        # category_id = self.category_id.id
        self.sudo().exists().unlink()
        return measurement_id


    @api.model
    def _load_pos_data_domain(self, data):
        return []

    @api.model
    def _load_pos_data_fields(self, config_id):
        return []

    def _load_pos_data(self, data):
        domain = self._load_pos_data_domain(data)
        fields = self._load_pos_data_fields(data['pos.config']['data'][0]['id'])
        return {
            'data': self.search_read(domain, fields, load=False) if domain is not False else [],
            'fields': fields,
        }