# Part of Softhealer Technologies.
{
    "name": "TH Point Of Sale training",
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
    "data": ["security/ir.model.access.csv","views/pre_define_note.xml","views/pos_order_view.xml"],
    "assets": {
        "point_of_sale._assets_pos": [
            "th_pos_training/static/src/overrides/control_buttons/sh_product_screen/sh_product_screen.xml",
            "th_pos_training/static/src/overrides/control_buttons/sh_product_screen/sh_product_screen.js",
            "th_pos_training/static/src/overrides/popups/sh_popup_screen/sh_popup_screen.js",
            "th_pos_training/static/src/overrides/popups/sh_popup_screen/sh_popup_screen.xml",
            "th_pos_training/static/src/overrides/control_buttons/sh_payment_screen/sh_payment_screen.js",
            "th_pos_training/static/src/overrides/control_buttons/sh_payment_screen/sh_payment_screen.xml",
            "th_pos_training/static/src/overrides/control_buttons/sh_receipt_screen/sh_receipt_screen.js",
            "th_pos_training/static/src/overrides/control_buttons/sh_receipt_screen/sh_receipt_screen.xml",
            "th_pos_training/static/src/overrides/popups/sh_payment_popup/sh_payment_popup.js",
            "th_pos_training/static/src/overrides/popups/sh_payment_popup/sh_payment_popup.xml",
            "th_pos_training/static/src/overrides/model/pos_store.js"
            
        ],
    },
    "auto_install": False,
    "installable": True,
}
