# Copyright (C) Softhealer Technologies.
from odoo import fields, models, api, _


class ProductTemplateInherit(models.Model):
    _inherit = 'product.product'

    # sh_is_raw_materil = fields.Boolean(string="Is Raw Material ? ")
    # sh_is_fabric = fields.Boolean(string="Is Fabric ? ")


    @api.model
    def _load_pos_data_fields(self, config_id):
        result = super()._load_pos_data_fields(config_id)
        result.extend(['bom_count', 'bom_ids', 'bom_line_ids', 'sh_is_fabric', 'sh_is_raw_materil'])
        return result