# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import fields, models, api


class ShMeasurementModificationRequest(models.Model):
    _name="sh.measurement.modification.request"
    _inherit = "sh.measurement.mixin"
    _description="Measurement Modification Request"

    sh_partner_id = fields.Many2one('res.partner',string="Customer")
    update_state = fields.Selection([('new','New'),('modified','Modified')])
    production_id = fields.Many2one("mrp.production", "Manufacturing Order", ondelete="cascade")
    sh_measurement_type_id = fields.Many2one('sh.measurement.type',string="Measurement Type")
    
    @api.model
    def sh_create_modification_req(self, vals):
        if vals:
            old_records = self.env['mrp.production'].sudo().search([('id', '=', vals[0].get('production_id'))])
            old_records.sudo().sh_measurement_modification_request_line.unlink()
        
        result = self.sudo().create(vals)

        return result

    @api.onchange('size_1' ,'size_2' ,'size_3' ,'size_4' ,'size_5' ,'size_6' ,'size_7' ,'size_8' ,'size_9' ,'size_10')
    def onchnage_sh_measurement_modification_request_line(self):
        self.update_state = 'modified'
        

    def _load_pos_data(self, data):
        domain = []
        fields = []
        return {
            'data': self.search_read(domain, fields, load=False) if domain is not False else [],
            'fields': fields,
        }
