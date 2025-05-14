# Part of Softhealer Technologies.
{
    "name": "Point Of Sale Product Min Qty",
    "author": "Softhealer Technologies",
    "website": "https://www.softhealer.com",
    "support": "support@softhealer.com",
    "category": "Point Of Sale",
    "license": "OPL-1",
    "summary": "Point Of Sale product Minimum Quantity",
    "description": """Point Of Sale product Minimum Quantity""",
    "version": "0.0.1",
    "depends": ["point_of_sale"],
    "application": True,
    "data": ["views/product.xml","views/res_config_setting.xml","views/res_partner.xml"],
    'assets': {
        'point_of_sale._assets_pos': ["sh_pos_min_qty/static/src/overrides/pos_store/pos_store.js","sh_pos_min_qty/static/src/overrides/pos_store/partner_list.js"],
    },
    "auto_install": False,
    "installable": True,
    "price": "7",
    "currency": "EUR"
}
