# Copyright (C) Softhealer Technologies.
from odoo import fields, models
from odoo.osv.expression import OR

class PosConfig(models.Model):
    _inherit = 'pos.config'

    sh_enable_bom = fields.Boolean(string="Enable BOM")
    sh_enable_piking_state = fields.Boolean(string="Create Piking In Waiting State")
    sh_default_invoice = fields.Boolean(string="Default invoice ? ")
    sh_transient_location_id = fields.Many2one("stock.location",string="Transient Location",domain="[('usage','=','internal')]")

    def _get_available_product_domain(self):
        domain = super()._get_available_product_domain()

        domain = OR([domain, [('sh_is_raw_materil', '=', True)]])
        domain = OR([domain, [('sh_is_fabric', '=', True)]])


        return domain