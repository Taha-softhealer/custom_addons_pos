# -*- coding: utf-8 -*-
# Part of Softhealer Technologies. See LICENSE file for full copyright and licensing details.
{
    "name": "Point Of Sale Mix Match Price",
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
    "data": ["views/product_pricelist_item.xml"],
    "assets": {
        "point_of_sale._assets_pos": [
            # "sh_pos_mix_match_price/static/src/pos_order_line.js",
            # "sh_pos_mix_match_price/static/src/product_product.js",
            "sh_pos_mix_match_price/static/src/overrides/pos_store.js",
            "sh_pos_mix_match_price/static/src/overrides/pos_order.js",
            "sh_pos_mix_match_price/static/src/overrides/order_summery.js",
            "sh_pos_mix_match_price/static/src/overrides/pos_order_line.js"
        ],
    },
    "auto_install": False,
    "installable": True,
}
