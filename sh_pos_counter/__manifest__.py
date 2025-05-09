# Part of Softhealer Technologies.
{
    "name": "POS Total Items Count",
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
    "data": ["views/res_config_setting.xml"],
    "assets": {
        "point_of_sale._assets_pos": [
            "sh_pos_counter/static/src/overrides/order_widget/order_widget.xml",
            "sh_pos_counter/static/src/overrides/order_widget/order_widget.js",
            "sh_pos_counter/static/src/overrides/order_widget/order_summary.xml",
            "sh_pos_counter/static/src/overrides/receipt_screen/receipt_screen.js",
            "sh_pos_counter/static/src/overrides/receipt_screen/receipt_screen.xml",
        ],
    },
    "auto_install": False,
    "installable": True,
}
