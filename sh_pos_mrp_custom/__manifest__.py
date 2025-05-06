# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.
{
    "name": "Point Of Sale MRP Custom",
    "author": "Softhealer Technologies",
    "website": "https://www.softhealer.com",
    "support": "support@softhealer.com",
    "category": "Point of Sale",
    "license": "OPL-1",
    "summary": "  ",
    "description": """  """,
    "version": "0.0.1",
    "depends": ["point_of_sale", "mrp", 'sh_pos_order_type',"hr"],
    "data": [
        'security/sh_measurement_security.xml',
        'security/ir.model.access.csv',
        'views/sh_mesurement_type.xml',
        'views/sh_mesurement_line.xml',
        'views/sh_measurement_category_views.xml',
        'views/sh_mesurement.xml',
        'views/product_template.xml',
        'views/product_product.xml',
        'views/res_partner.xml',
        'views/res_config_settings.xml',
        'views/pos_order.xml',
        'views/sh_measurement_modification_request_line.xml',
        'views/mrp_workorder_views.xml',
        'views/mrp_routing_workcenter_views.xml',
        'views/mrp_production.xml',
        'views/sh_refund_notes.xml',
        'views/sh_refund_orders.xml',
        'views/sh_design_category.xml',
        'views/sh_design_type.xml',
        'views/sh_design.xml',
        'views/sh_stock_quant_orderpoint_views.xml',
        'views/mrp_bom.xml',
        'views/pos_order_portal_templates.xml',
        'report/mrp_production_templates.xml',
    ],
    'assets': {'point_of_sale._assets_pos': [
        "sh_pos_mrp_custom/static/src/apps/models/models.js",
        "sh_pos_mrp_custom/static/src/override/orderline/orderline.js",
        'sh_pos_mrp_custom/static/src/override/orderline/orderline.xml',
        "sh_pos_mrp_custom/static/src/apps/models/data_service.js",
        "sh_pos_mrp_custom/static/src/apps/control_buttons/sh_line_partner_button/sh_line_partner_button.js",
        "sh_pos_mrp_custom/static/src/apps/control_buttons/sh_line_partner_button/sh_line_partner_button.xml",
        #  'sh_pos_mrp_custom/static/src/apps/models/posStore.js',
        #  'sh_pos_mrp_custom/static/src/apps/models/pos_bus.js',
        #  'sh_pos_mrp_custom/static/src/override/PartnerListScreen/*',
        #  'sh_pos_mrp_custom/static/src/apps/models/models.js',
        #  'sh_pos_mrp_custom/static/src/apps/popups/**/*',
        #  'sh_pos_mrp_custom/static/src/apps/control_buttons/**/*',
        #  'sh_pos_mrp_custom/static/src/override/payment_screen/*',
        #  'sh_pos_mrp_custom/static/src/override/orderline/*',
        #  'sh_pos_mrp_custom/static/src/override/product_screen/*',
        #  'sh_pos_mrp_custom/static/src/apps/popups/sh_order_refund_popup/*',
        #  'sh_pos_mrp_custom/static/src/apps/popups/sh_modification_popup/*',
        #  'sh_pos_mrp_custom/static/src/override/ticket_screen/*',
        #  'sh_pos_mrp_custom/static/src/override/OrderReceipt/order_Receipt.xml',
        #  'sh_pos_mrp_custom/static/src/override/OrderReceipt/receipt_screen.js',

        
        # Controll Buttons 

        # Measurement Button

        "sh_pos_mrp_custom/static/src/apps/control_buttons/measurment_button/measurment_button.js",
        "sh_pos_mrp_custom/static/src/apps/control_buttons/measurment_button/measurment_button.xml",

        # Product Design Button
        "sh_pos_mrp_custom/static/src/apps/control_buttons/sh_product_design_button/sh_product_design_button.js",
        "sh_pos_mrp_custom/static/src/apps/control_buttons/sh_product_design_button/sh_product_design_button.xml",

        # Update BOM Button
        "sh_pos_mrp_custom/static/src/apps/control_buttons/sh_update_bom_button/sh_update_bom_button.js",
        "sh_pos_mrp_custom/static/src/apps/control_buttons/sh_update_bom_button/sh_update_bom_button.xml",

        # Dependency Button
        "sh_pos_mrp_custom/static/src/apps/control_buttons/ShDependencyButton/ShDependencyButton.js",
        "sh_pos_mrp_custom/static/src/apps/control_buttons/ShDependencyButton/ShDependencyButton.xml",

        # Popup Widgets 

        # Measurement Selection Popup.
        "sh_pos_mrp_custom/static/src/apps/popups/MeasurementSelectionPopup/MeasurementSelectionPopup.js",
        "sh_pos_mrp_custom/static/src/apps/popups/MeasurementSelectionPopup/MeasurementSelectionPopup.xml",

        # Update BOM Popup 
        "sh_pos_mrp_custom/static/src/apps/popups/sh_update_bom_popup/sh_update_bom_popup.js",
        "sh_pos_mrp_custom/static/src/apps/popups/sh_update_bom_popup/sh_update_bom_popup.xml",

        # Update BOM Popup 2 
        "sh_pos_mrp_custom/static/src/apps/popups/sh_update_bom_component_2/sh_update_bom_popup.js",
        "sh_pos_mrp_custom/static/src/apps/popups/sh_update_bom_component_2/sh_update_bom_popup.xml",

        # component used in popup
        "sh_pos_mrp_custom/static/src/apps/popups/sh_update_bom_popup/components/bom_components/bom_components.js",
        "sh_pos_mrp_custom/static/src/apps/popups/sh_update_bom_popup/components/bom_components/bom_components.xml",

        # bom add line
        "sh_pos_mrp_custom/static/src/apps/popups/sh_update_bom_popup/components/bom_add_line/bom_add_line.js",
        "sh_pos_mrp_custom/static/src/apps/popups/sh_update_bom_popup/components/bom_add_line/bom_add_line.xml",


        # Measurement Popup
        "sh_pos_mrp_custom/static/src/apps/popups/MesurementPopup/MesurementPopup.xml",
        "sh_pos_mrp_custom/static/src/apps/popups/MesurementPopup/MesurementPopup.js",


        #  OVERRIDE ======

        # PosStore Inherit
        "sh_pos_mrp_custom/static/src/apps/models/posStore.js",

    ]},
    "application": True,
    "auto_install": False,
    "installable": True,
    "images": ["static/description/background.png", ],
    "currency": "EUR"
}
