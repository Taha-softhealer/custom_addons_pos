from odoo import api, fields, models

class ResPartner(models.Model):
    _inherit = 'res.partner'

    sh_user_ids = fields.Many2many('res.users',string="Point Of Sale User")
    
    def _load_pos_data_fields(self, config_id):
        result=super()._load_pos_data_fields(config_id)
        result+=["sh_user_ids"]
        return result

    def _load_pos_data_domain(self, data):
        # updatedres=[]
        res=super()._load_pos_data_domain(data)
        # record=self.env["res.partner"].browse(res[0][2])
        # print('\n\n\n-----res------->',res)
        # for partner in record:
        #     if self.env.user.id in partner.sh_user_ids.ids:
        #         updatedres.append(partner.id)
        # print('\n\n\n-----updatedres------->',updatedres)
        # res[0][2]=updatedres
        return [('id', 'in', res[0][2]),('sh_user_ids', 'in', self.env.user.id)]
