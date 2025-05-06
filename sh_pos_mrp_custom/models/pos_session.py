# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models, fields, api
from odoo.osv.expression import AND
from odoo.addons.bus.models.bus_presence import AWAY_TIMER
from odoo.addons.bus.models.bus_presence import DISCONNECTION_TIMER

class PosSession(models.Model):
    _inherit="pos.session"

    @api.model
    def _load_pos_data_models(self, config_id):

        result = super()._load_pos_data_models(config_id)
        result += ['mrp.production',
                   "mrp.bom", 
                   'mrp.bom.line',
                   "sh.pos.order.line.component",
                   "sh.measurement", 
                   "sh.measurement.line", 
                   "sh.measurement.category",
                   "sh.measurement.type",
                   "sh.modification.request",
                #    "sh.measurement.mixin",
                   "sh.pos.order.line.measurement",
                   "sh.mrp.production.measurement",
                   'sh.measurement.modification.request'
                   ]
        return result

    
    def get_all_employees(self):

        self.env.cr.execute(""" SELECT emp.id,emp.name FROM hr_employee emp """)
        employees = self.env.cr.dictfetchall()

        return employees


    def get_active_sessions_user_partners(self,domain=None):
        # if domain is None:
        #     domain = [('state', 'in', ['opening_control', 'opened'])]
        # else:
        #     domain = AND([[('state', 'in', ['opening_control', 'opened'])],domain])
        # pos_sessions = self.sudo().search(domain)
        query = """
                SELECT
                    partner.id
                FROM bus_presence AS presence
                JOIN res_users AS users ON users.id = presence.user_id
                JOIN res_partner AS partner ON users.partner_id = partner.id
                WHERE age(now() AT TIME ZONE 'UTC', last_poll) <= interval %s
                    OR age(now() AT TIME ZONE 'UTC', last_presence) <= interval %s
                """
        
        self.env.cr.execute(query,("%s seconds" % DISCONNECTION_TIMER, "%s seconds" % AWAY_TIMER))
        
        partner_ids = [status[0] for status in self.env.cr.fetchall() if status and status[0]]
        
        return self.env['res.partner'].browse(partner_ids)