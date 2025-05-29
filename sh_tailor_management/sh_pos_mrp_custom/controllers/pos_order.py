# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies

from odoo import _, http
from odoo.http import request
from odoo.osv.expression import AND

from odoo.addons.portal.controllers.portal import CustomerPortal, pager as portal_pager


class PortalPOS(CustomerPortal):

    def _get_pos_orders_domain(self, domain=None):
        if not domain:
            domain = [("partner_id", "=", request.env.user.partner_id.id)]
        else:
            domain = AND(
                [[("partner_id", "=", request.env.user.partner_id.id)], domain])
        return domain

    def _prepare_home_portal_values(self, counters):
        values = super()._prepare_home_portal_values(counters)
        if "pos_order_count" in counters:
            values["pos_order_count"] = request.env["pos.order"].sudo(
            ).search_count(self._get_pos_orders_domain())

        return values

    @http.route(["/my/pos/orders", "/my/pos/orders/page/<int:page>"], type="http", auth="user", website=True)
    def portal_my_pos_orders(self, page=1, sortby=None, filterby=None, search=None, search_in="all", groupby="none", **kw):
        values = self._prepare_portal_layout_values()
        PosOrder = request.env["pos.order"]
        _items_per_page = 100

        orders = PosOrder.sudo().search(self._get_pos_orders_domain())

        # pager
        pager = portal_pager(
            url="/my/pos/orders",
            url_args={'sortby': sortby, 'search_in': search_in,
                      'search': search, 'filterby': filterby, 'groupby': groupby},
            total=len(orders),
            page=page,
            step=_items_per_page
        )
        values.update({
            "pos_orders": orders,
            "page_name": "pos_order",
            "default_url": "/my/pos/orders",
            "pager": pager,
        })
        return request.render("sh_pos_mrp_custom.portal_my_pos_orders", values)
