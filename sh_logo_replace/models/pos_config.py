from odoo import api, fields, models

class PosConfig(models.Model):
    _inherit = 'pos.config'

    enable_pos_receipt_logo = fields.Boolean()
    receipt_logo = fields.Binary()
    enable_pos_header_logo = fields.Boolean()
    header_logo = fields.Binary()
    
    group_pos_disable_dis = fields.Boolean(compute="_compute_group_pos_disable_dis")
    group_pos_disable_numpad = fields.Boolean(compute="_compute_group_pos_disable_numpad")
    group_pos_disable_pm = fields.Boolean(compute="_compute_group_pos_disable_pm")
    group_pos_disable_qty = fields.Boolean(compute="_compute_group_pos_disable_qty")
    group_pos_disable_customer_selection = fields.Boolean(compute="_compute_group_pos_disable_customer_selection")
    group_pos_disable_newdel = fields.Boolean(compute="_compute_group_pos_disable_newdel")
    group_pos_disable_payment = fields.Boolean(compute="_compute_group_pos_disable_payment")
    group_pos_disable_price = fields.Boolean(compute="_compute_group_pos_disable_price")
    group_pos_disable_remove = fields.Boolean(compute="_compute_group_pos_disable_remove")
    
    def _compute_group_pos_disable_dis(self):
        for rec in self:
            if self.env.user.has_group("sh_logo_replace.pos_disable_dis"):
                rec.group_pos_disable_dis=True
            else:
                rec.group_pos_disable_dis=False

    def _compute_group_pos_disable_numpad(self):
        for rec in self:
            if self.env.user.has_group("sh_logo_replace.pos_disable_numpad"):
                rec.group_pos_disable_numpad=True
            else:
                rec.group_pos_disable_numpad=False
    
    def _compute_group_pos_disable_pm(self):
        for rec in self:
            if self.env.user.has_group("sh_logo_replace.pos_disable_pm"):
                rec.group_pos_disable_pm=True
            else:
                rec.group_pos_disable_pm=False
    
    def _compute_group_pos_disable_qty(self):
        for rec in self:
            if self.env.user.has_group("sh_logo_replace.pos_disable_qty"):
                rec.group_pos_disable_qty=True
            else:
                rec.group_pos_disable_qty=False
    
    def _compute_group_pos_disable_customer_selection(self):
        for rec in self:
            if self.env.user.has_group("sh_logo_replace.pos_disable_customer_selection"):
                rec.group_pos_disable_customer_selection=True
            else:
                rec.group_pos_disable_customer_selection=False
    
    def _compute_group_pos_disable_newdel(self):
        for rec in self:
            if self.env.user.has_group("sh_logo_replace.pos_disable_newdel"):
                rec.group_pos_disable_newdel=True
            else:
                rec.group_pos_disable_newdel=False
    
    def _compute_group_pos_disable_payment(self):
        for rec in self:
            if self.env.user.has_group("sh_logo_replace.pos_disable_payment"):
                rec.group_pos_disable_payment=True
            else:
                rec.group_pos_disable_payment=False
    
    def _compute_group_pos_disable_price(self):
        for rec in self:
            if self.env.user.has_group("sh_logo_replace.pos_disable_price"):
                rec.group_pos_disable_price=True
            else:
                rec.group_pos_disable_price=False
    
    def _compute_group_pos_disable_remove(self):
        for rec in self:
            if self.env.user.has_group("sh_logo_replace.pos_disable_remove"):
                rec.group_pos_disable_remove=True
            else:
                rec.group_pos_disable_remove=False