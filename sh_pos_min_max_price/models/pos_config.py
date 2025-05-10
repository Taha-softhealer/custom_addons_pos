from odoo import api, fields, models

class PosConfig(models.Model):
    _inherit = 'pos.config'

    group_pos_product_min_max_price = fields.Boolean(compute="_compute_group_pos_product_min_max_price")
    group_allow_confirm_pos_product_sale_price = fields.Boolean(compute="_compute_group_allow_confirm_pos_product_sale_price")
    
    def _compute_group_pos_product_min_max_price(self):
        for rec in self:
            if self.env.user.has_group("sh_pos_min_max_price.group_product_min_max_price"):
                rec.group_pos_product_min_max_price=True
            else:
                rec.group_pos_product_min_max_price=False

    def _compute_group_allow_confirm_pos_product_sale_price(self):
        for rec in self:
            if self.env.user.has_group("sh_pos_min_max_price.group_allow_confirm_pos_product_sale_price"):
                rec.group_allow_confirm_pos_product_sale_price=True
            else:
                rec.group_allow_confirm_pos_product_sale_price=False