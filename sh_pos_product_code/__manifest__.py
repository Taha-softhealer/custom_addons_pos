# Part of Softhealer Technologies.
{
    "name": "Point Of Sale Product code",
    "author": "Softhealer Technologies",
    "website": "https://www.softhealer.com",
    "support": "support@softhealer.com",
    "category": "Point Of Sale",
    "license": "OPL-1",
    "summary": "Point Of Sale product code",
    "description": """Point Of Sale product code""",
    "version": "0.0.1",
    "depends": ["point_of_sale"],
    "application": True,
    "data": ["views/res_config_setting.xml"],
    'assets': {
        'point_of_sale._assets_pos': [
            "sh_pos_product_code/static/src/overrides/product_card/product_card.xml",
            "sh_pos_product_code/static/src/overrides/product_card/product_card.js",
            "sh_pos_product_code/static/src/overrides/product_screen/product_screen.xml",
            "sh_pos_product_code/static/src/overrides/orderline/orderline.js",
            "sh_pos_product_code/static/src/overrides/orderline/orderline.xml",
            "sh_pos_product_code/static/src/overrides/order_receipt/order_receipt.js"
        ],
    },
    "auto_install": False,
    "installable": True,
    "price": "7",
    "currency": "EUR"
}
