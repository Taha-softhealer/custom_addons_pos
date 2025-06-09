# -*- coding: utf-8 -*-

from odoo import models, fields, api, _
from odoo.exceptions import ValidationError,UserError

class ShHrEmployee(models.Model):
    _inherit = 'hr.employee'
    
    sh_pos_create_product = fields.Boolean("POS Create Product")