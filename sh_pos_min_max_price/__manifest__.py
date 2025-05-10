# Part of Softhealer Technologies.
{
    "name": "Point Of Sale Product Price Min Max",
    "author": "Softhealer Technologies",
    "website": "https://www.softhealer.com",
    "support": "support@softhealer.com",
    "category": "Point Of Sale",
    "license": "OPL-1",
    "summary": "Point Of Sale Orderline product minimum and maximum price",
    "description": """Point Of Sale Orderline product minimum and maximum price""",
    "version": "0.0.1",
    "depends": ["point_of_sale"],
    "application": True,
    "data": ["security/sh_pos_min_max_price_security.xml","views/product.xml"],
    'assets': {
        'point_of_sale._assets_pos': [
            "sh_pos_min_max_price/static/src/overrides/orderline/orderline.xml",
            "sh_pos_min_max_price/static/src/overrides/orderline/orderline.js",
            "sh_pos_min_max_price/static/src/overrides/orderline/order_summery.xml"
        ],
    },
    "auto_install": False,
    "installable": True,
    "price": "7",
    "currency": "EUR"
}
