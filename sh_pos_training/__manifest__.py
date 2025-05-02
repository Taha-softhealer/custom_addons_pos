# Part of Softhealer Technologies.
{
    "name": "Point Of Sale training",
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
    "data": [
            "security/ir.model.access.csv",        
             "views/pre_define_note.xml",
             "views/pos_order_view.xml",
             ],
    'assets': {'point_of_sale._assets_pos': 
               [
                    "sh_pos_training/static/src/app/popups/sh_screen_popup/sh_screen_popup.js",
                    "sh_pos_training/static/src/app/popups/sh_screen_popup/sh_screen_popup.xml",
                   "sh_pos_training/static/src/app/control_buttons/sh_custom_screen_button/sh_custom_screen_button.xml",
                   "sh_pos_training/static/src/app/control_buttons/sh_custom_screen_button/sh_custom_screen_button.js",
                   "sh_pos_training/static/src/overrides/model/pos_store.js",
                   "sh_pos_training/static/src/app/screen/receipt_screen/receipt_screen.xml",
                   "sh_pos_training/static/src/app/screen/ordeline.xml",
                   "sh_pos_training/static/src/app/custom_screen/custom_screen.js",
                   "sh_pos_training/static/src/app/custom_screen/custom_screen.xml",
               ],
               
               },
    "auto_install": False,
    "installable": True,
}
