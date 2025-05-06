# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.
{
    "name": "Point Of Sale Order Types",
    "author": "Softhealer Technologies",
    "website": "https://www.softhealer.com",
    "support": "support@softhealer.com",
    "category": "Point of Sale",
    "license": "OPL-1",
    "summary": "POS Order Types, Point Of Sale Orders Types,Order Types in POS,Order Types in point of sale,pos orders,point of sale orders types,pos default order type,POS order default odoo",
    "description": """The purpose of the module is that POS users can choose the type of POS order on the POS screen. You have to create the order types that will be displayed on the POS screen. POS users can choose order types for each POS order or you can set the default order type for the same order. It prints the order type of the selected order in the receipt. When an order is confirmed you can see that order from the backend as well.""",
    "version": "0.0.1",
    "depends": ["sh_base_order_type", "point_of_sale"],
    "data": [
        'views/sh_order_type_views.xml',
        'views/res_config_settings_views.xml',
        'views/pos_order_views.xml'
    ],
    'assets': {'point_of_sale._assets_pos': [
        'sh_pos_order_type/static/src/apps/control_buttons/order_type_button/*',
        'sh_pos_order_type/static/src/apps/popups/sh_order_type_popup/*',
        'sh_pos_order_type/static/src/overrides/**/*'
    ]},
    "application": True,
    "auto_install": False,
    "installable": True,
    "images": ["static/description/background.png", ],
    "price": 20,
    "currency": "EUR"
}
