# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies

from odoo import fields, models,api

class ShMeasurementMixin(models.AbstractModel):
    _name="sh.measurement.mixin"
    _description="Measurement Mixin"

    size_1 = fields.Char(string="Size 1")
    size_2 = fields.Char(string="Size 2")
    size_3 = fields.Char(string="Size 3")
    size_4 = fields.Char(string="Size 4")
    size_5 = fields.Char(string="Size 5")
    size_6 = fields.Char(string="Size 6")
    size_7 = fields.Char(string="Size 7")
    size_8 = fields.Char(string="Size 8")
    size_9 = fields.Char(string="Size 9")
    size_10 = fields.Char(string="Size 10")
    category_id = fields.Many2one("sh.measurement.category", string="Measurement Category",ondelete="cascade")
    sh_uom_id = fields.Many2one('uom.uom', string="UoM")
    employee_id = fields.Many2one('hr.employee', string="employee")


    def read_measurement_vals_list(self,fields,load=False):
        model_fields = ["size_1","size_2","size_3","size_3","size_5","size_6","size_7","size_8","size_9","size_10","sh_uom_id"]
        if fields:
            model_fields+=fields
        return self.read(model_fields,load=load)

    def _load_pos_data(self, data):
            domain = []
            fields = []
            return {
                'data': self.search_read(domain, fields, load=False) if domain is not False else [],
                'fields': fields,
            }