# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields, api

class ShPosOrderLineMeasurement(models.Model):
    _name="sh.pos.order.line.measurement"
    _inherit = "sh.measurement.mixin"
    _description="order line measurement details"

    sh_measurement_type_id = fields.Many2one('sh.measurement.type',string="Measurement Type")
    sh_measurement_line_id = fields.Many2one("pos.order.line", string="line")
    employee_id = fields.Many2one('hr.employee', string="employee")
 

    def _load_pos_data(self, data):
        domain = []
        fields = []
        return {
            'data': self.search_read(domain, fields, load=False) if domain is not False else [],
            'fields': fields,
        }