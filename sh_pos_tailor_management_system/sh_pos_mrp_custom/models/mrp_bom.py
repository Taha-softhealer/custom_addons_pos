# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies

from odoo import _, fields, models,api

class MrpBomInherit(models.Model):
    _inherit = "mrp.bom"

    sh_require_fabric = fields.Boolean(string="Require Fabric")

    @api.model
    def create(self,vals_list):
        res = super().create(vals_list)
        return res

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


class MrpBomLineInherit(models.Model):
    _inherit = "mrp.bom.line"

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
