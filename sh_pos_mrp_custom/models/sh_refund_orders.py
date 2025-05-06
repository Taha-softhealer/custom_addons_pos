# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies

from odoo import _, api, fields, models

class shRefundNotes(models.Model):
    _name = "sh.order.refund"
    _description = "use this model for order refund"
    
    sh_pos_order_id = fields.Many2one("pos.order", string="pos order")
    sh_mrp_order_id = fields.Many2one("mrp.production", string="Manufacturing Order",ondelete="set null")
    sh_partner_id = fields.Many2one("res.partner" , string="Customer")
    sh_order_reason_id = fields.Many2one('sh.refund.note', string="Reason")
    sh_order_reason_note = fields.Char(string='Reason Note')
