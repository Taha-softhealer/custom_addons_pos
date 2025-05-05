# Part of Softhealer Technologies.
{
    "name": "server screen logo changer",
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
    "data": ["views/res_config_setting.xml","security/sh_logo_replace.xml"],
    "assets": {
        "point_of_sale._assets_pos": [
            "sh_logo_replace/static/src/overrides/server_screen.xml",
            "sh_logo_replace/static/src/overrides/models/pos_store.js",
            "sh_logo_replace/static/src/overrides/product_screen/product_screen.xml",
            "sh_logo_replace/static/src/overrides/product_screen/product_screen.js",
            "sh_logo_replace/static/src/overrides/action_widget/action_widget.xml",
            "sh_logo_replace/static/src/overrides/action_widget/action_widget.css",
            "sh_logo_replace/static/src/overrides/action_widget/select_partner.xml",
            "sh_logo_replace/static/src/overrides/action_widget/payment_screen.xml",
            "sh_logo_replace/static/src/overrides/action_widget/navbar.xml",
            "sh_logo_replace/static/src/overrides/action_widget/ticket_screen.xml",
            "sh_logo_replace/static/src/overrides/action_widget/control_buttons.xml"
        ],
    },
    "auto_install": False,
    "installable": True,
}
