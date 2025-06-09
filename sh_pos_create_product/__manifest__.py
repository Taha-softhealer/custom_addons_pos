# -*- coding: utf-8 -*-
# Part of Softhealer Technologies. See LICENSE file for full copyright and licensing details.
{
    "name": "POS Create Product",
    "author": "Softhealer Technologies",
    "website": "https://www.softhealer.com",
    "support": "support@softhealer.com",
    "category": "Point Of Sale",
    "license": "OPL-1",
    "summary": "",
    "description": """""",
    "version": "0.0.1",
    "depends": ["point_of_sale"],
    "application": True,
    "data": ["views/product_view.xml","views/hr_employee.xml"],
    "assets": {
        "point_of_sale._assets_pos": ["sh_pos_create_product/static/src/overrides/navbar.xml"],
    },
    "auto_install": False,
    "installable": True,
}
