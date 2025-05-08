# Part of Softhealer Technologies.
{
    "name": "POS quick print receipt ",
    "author": "Softhealer Technologies",
    "website": "https://www.softhealer.com",
    "support": "support@softhealer.com",
    "category": "Point of Sale",
    "summary": "",
    "description": """""",
    "license": "OPL-1",
    "version": "0.0.1",
    "depends": ["point_of_sale"],
    "application": True,
    "data": ["views/res_config.xml"],
    "assets": {
        "point_of_sale._assets_pos": [
            "sh_quick_receipt/static/src/overrides/screens/product_screen/product_screen.xml",
            "sh_quick_receipt/static/src/overrides/screens/product_screen/product_screen.js",
            "sh_quick_receipt/static/src/overrides/screens/custom_popup/custom_popup.js",
            "sh_quick_receipt/static/src/overrides/screens/custom_popup/custom_popup.xml"
        ],
    },
    "auto_install": False,
    "installable": True,
}
