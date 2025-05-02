# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models, tools, _, Command


class ShOrderNote(models.Model):
    _name = "sh.order.note"
    _description = "Custome Order Note"

    name = fields.Char("Note")
    pos_config_id = fields.Many2one(
        "pos.config",
        string="Pos Config",
    )


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
