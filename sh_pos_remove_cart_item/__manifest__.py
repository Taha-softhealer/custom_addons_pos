# Part of Softhealer Technologies.
{
    "name": "Point Of Sale Remove Cart Item",
    "author": "Softhealer Technologies",
    "website": "https://www.softhealer.com",
    "support": "support@softhealer.com",
    "category": "Point Of Sale",
    "license": "OPL-1",
    "summary": "Point Of Sale Cart Item Remove POS Item Remove POS Clear Cart Point Of Sale Clear Cart POS Cart Items Remove POS Cart Clear Point Of Sale Cart Clear POS Items Remove From Cart POS Delete Cart Items Odoo POS Items Count",
    "description": """This module will help your POS user to clear the whole cart just one click. This module provides a button in the cart where you can clear the cart. You can also remove one by one product from the cart using a separate delete button.""",
    "version": "0.0.1",
    "depends": ["point_of_sale"],
    "application": True,
    "data": ['views/res_config_settings.xml', ],
    'assets': {
        'point_of_sale._assets_pos': [
            'sh_pos_remove_cart_item/static/src/app/control_buttons/RemoveAllItemButton/*',
            'sh_pos_remove_cart_item/static/src/overrides/orderline/orderline.xml',
            'sh_pos_remove_cart_item/static/src/overrides/models/models.js'
        ],
    },
    "images": ["static/description/background.png", ],
    "auto_install": False,
    "installable": True,
    "price": "7",
    "currency": "EUR"
}
