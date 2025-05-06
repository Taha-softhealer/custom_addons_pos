# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies

from odoo import _, api, fields, models

class shRefundNotes(models.Model):
    _name = "sh.refund.note.selection"
    _description = "use this model for refund note selection"

    name = fields.Char(string="Name")
    sh_refund_note_id = fields.Many2one('sh.refund.note', string="Refund note")
    