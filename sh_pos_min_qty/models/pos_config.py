# from odoo import models, fields

# class PosConfig(models.Model):
#     _inherit = 'pos.config'
    
#     def _get_available_product_domain(self):
#         result=super()._get_available_product_domain()
#         if not self.env.user.has_group("point_of_sale.group_pos_manager"):
#             result.append(("sh_res_user_ids","in",self.env.user.id))
#         return result