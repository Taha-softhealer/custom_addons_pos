# Copyright (C) Softhealer Technologies.
from odoo import fields, models, api


class PreDefineNote(models.Model):
    _name = "pre.define.note"
    _description = "Pre Define Note"
    _order = "name desc"


    name = fields.Char("Name")
    pos_config_id = fields.Many2one("pos.config" ,"POS Config")



    @api.model
    def _load_pos_data_domain(self, data):
        return []
    @api.model
    def _load_pos_data_fields(self, config_id):
        return ["name"]


    def _load_pos_data(self, data):
        domain = self._load_pos_data_domain(data)
        fields = self._load_pos_data_fields(data['pos.config']['data'][0]['id'])
        return {
            'data': self.search_read(domain, fields, load=False) if domain is not False else [],
            'fields': fields,
        }
    
    @api.model_create_multi
    def create(self, values):
        result = super().create(values)
        all_config = self.env["pos.config"].search([])
        print("\n\n\n\n\n\n\n\n all", all_config)
        for each_config in all_config:
                print("\n\n\n\n\n\n\n\n each_config", each_config)
                each_config._notify(("CREATE_NOTE"), {'data' : result.id})
        return result