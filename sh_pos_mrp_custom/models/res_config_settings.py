# Copyright (C) Softhealer Technologies.
from odoo import fields, models

class ResConfigSettings(models.TransientModel):
    _inherit = "res.config.settings"

    sh_enable_bom = fields.Boolean(string="Enable BOM", related='pos_config_id.sh_enable_bom' , readonly=False)
    sh_enable_piking_state = fields.Boolean(string="Create Piking In Waiting State", related='pos_config_id.sh_enable_piking_state' , readonly=False)
    sh_default_invoice = fields.Boolean(related='pos_config_id.sh_default_invoice', readonly=False)
    sh_transient_location_id = fields.Many2one(related='pos_config_id.sh_transient_location_id', readonly=False)