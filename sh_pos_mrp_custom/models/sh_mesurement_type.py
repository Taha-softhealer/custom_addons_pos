# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields, api
from odoo.exceptions import UserError

class ShMeasurementType(models.Model):
    _name = "sh.measurement.type"
    _inherit = "sh.measurement.mixin"
    _description = " This model is use for measurement type selection "

    name = fields.Char(string="Name")
    type_uom_ids = fields.Many2many('uom.uom', string="Type UoM", required=True)
    sh_enter_size_length = fields.Integer('Size Length', default=1,)
    sh_measurement_categ_ids = fields.Many2many('sh.measurement.category', 'sh_measurement_category_sh_measurement_type_rel', column1='sh_measurement_type_id', column2="sh_measurement_category_id", string="Measurement Categorys")
    
    @api.onchange('sh_enter_size_length')
    def onchangesizelen(self):
        if self.sh_enter_size_length > 10:
            raise UserError("Please enter lessthan 10 !")
        
    def _load_pos_data(self, data):
        domain = []
        fields = []
        return {
            'data': self.search_read(domain, fields, load=False) if domain is not False else [],
            'fields': fields,
        }