# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields, api

class ShPosMoStage(models.Model):
    _name="sh.pos.mo.stage"
    _description="mo Stages details"
    _rec_name="sh_measurement_id"


    sh_product_id = fields.Many2one('mrp.production', string="Production order")
    sh_production_stage = fields.Selection(related='sh_product_id.state')