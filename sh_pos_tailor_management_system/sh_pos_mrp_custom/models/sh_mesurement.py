# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields, api, Command

class ShMeasurement(models.Model):
    _name="sh.measurement"
    _description="measurement details"

    name = fields.Char(string="Name")
    sh_measurement_note = fields.Char(string="Note")
    category_id = fields.Many2one("sh.measurement.category","Measurement Category")
    employee_id = fields.Many2one('hr.employee', string="Employee")
    gender = fields.Selection([('man', 'Man'), ('woman', 'Woman')], string="Gender", default="man")
    sh_measurement_line_ids = fields.One2many("sh.measurement.line", 'sh_measurement_id', string="lines")
    sh_partner_id = fields.Many2one('res.partner',string="Customer")


    @api.model
    def default_get(self, default_fields):
        default = super().default_get(default_fields)
        if self._context:
            if self._context.get('sh_partner_id'):
                default['sh_partner_id'] = self._context.get('sh_partner_id')
        return default

    def sh_get_measurement_data(self):
        measurements = []
        for measurement in self.sudo():
            m_vals = measurement.read(['id', 'name', 'category_id', 'sh_partner_id', 'sh_measurement_note', 'employee_id'])
            if m_vals: 
                if m_vals[0]['category_id']: 
                    m_vals[0]['category_id'] = m_vals[0]['category_id'][0]
                if m_vals[0]['employee_id']: 
                    m_vals[0]['employee_id'] = m_vals[0]['employee_id'][0]
                m_vals[0]["sh_measurement_line_ids"] = measurement.sh_measurement_line_ids.read(['sh_measurement_type_id', 'size_1','size_2','size_3','size_4','size_5','size_6','size_7','size_8','size_9','size_10', 'sh_uom_id'])
                measurements.append(m_vals[0])

        return measurements
    
    @api.onchange('category_id')
    def _onchange_category_id(self):
        self.sh_measurement_line_ids = []
        vals = [ Command.create({'sh_measurement_type_id': line.id,'sh_uom_id': line.type_uom_ids[:1] }) for line in  self.category_id.sh_measurement_line_ids]
        self.sh_measurement_line_ids = [Command.clear()] + vals
       
    
    def sh_duplicate_rec(self):
        duplicate_obj = self.copy()
        for line in self.sh_measurement_line_ids:
            new_line = line.copy()
            new_line.sh_measurement_id = duplicate_obj.id

            

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