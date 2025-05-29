# -*- coding: utf-8 -*-
# Part of Softhealer Technologies. See LICENSE file for full copyright and licensing details.

from odoo import fields, models, api


class sh_design(models.Model):
    _name = "sh.design"
    _description = "design details"
    _rec_name = "category_id"

    category_id = fields.Many2one("sh.design.category")
    type_id = fields.Many2one("sh.design.type")
    image=fields.Binary(related="type_id.image")
    sh_measurment = fields.Many2one("sh.measurement")
    sh_production_order_id = fields.Many2one("mrp.production")
    

    # @api.onchange("category_id")
    # def _onchange_name(self):
    #     if(self.category_id):
    #         record=self.env["sh.design.type"].search([("design_category", "=", self.category_id.name)])

    #         print('\n\n\n-----record------->',record)
    #         print('\n\n\n-----self.category_id------->',self.category_id.design_type_ids)
