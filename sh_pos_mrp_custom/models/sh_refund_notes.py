# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies

from odoo import _, api, fields, models

class shRefundNotes(models.Model):
    _name = "sh.refund.note"
    _description = "use this model for pre define notes"

    name = fields.Char(string="Name")
    is_selection = fields.Boolean(string="Enable Selection")
    refund_selection_ids = fields.One2many('sh.refund.note.selection', 'sh_refund_note_id', string="Refund Reson Selection")