# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies

from odoo import _, api, fields, models


class ShModificationRequest(models.Model):
    _name = "sh.modification.request"
    _description="Modification Request"
    
    serial_no = fields.Char("Sr. No.",compute="_compute_serial_no")
    update_state = fields.Selection([('new','New'),('modified','Modified')])
    final_product_id = fields.Many2one("product.product", "Final Component",check_company=True, domain="[('type', 'in', ('product','consu'))]")
    modified_product_id = fields.Many2one("product.product", "Modified Component",required=True, check_company=True, domain="[('type', 'in', ('product','consu'))]")
    product_qty = fields.Float("Quantity", default=1.0, digits="Product Unit of Measure", required=True)

    pos_order_id = fields.Many2one("pos.order", "POS Order", ondelete="cascade")
    production_id = fields.Many2one("mrp.production", "Manufacturing Order", ondelete="cascade")
    company_id = fields.Many2one("res.company", "Company", related="pos_order_id.company_id")
    product_uom_id = fields.Many2one('uom.uom', string="Type UoM")
    product_uom_category_id = fields.Many2one(comodel_name='uom.category', related='modified_product_id.uom_id.category_id',)

    @api.depends("pos_order_id")
    def _compute_serial_no(self):
        serial_no = 1
        for mr in self:
            if len(mr.pos_order_id.sh_modification_request_line) != len(mr.pos_order_id._origin.sh_modification_request_line):
                serial_no=len(mr.pos_order_id._origin.sh_modification_request_line+mr.pos_order_id.sh_modification_request_line)
            mr.serial_no = serial_no
            serial_no+=1

    def _load_pos_data(self, data):
        domain = []
        fields = []
        return {
            'data': self.search_read(domain, fields, load=False) if domain is not False else [],
            'fields': fields,
        }
