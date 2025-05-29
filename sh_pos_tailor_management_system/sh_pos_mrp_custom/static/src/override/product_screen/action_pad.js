/** @odoo-module */

import { ActionpadWidget } from "@point_of_sale/app/screens/product_screen/action_pad/action_pad";
import { patch } from "@web/core/utils/patch";
import { Component, useState, useRef, onMounted } from "@odoo/owl";


patch(ActionpadWidget.prototype, {
    setup() {
        super.setup()
        onMounted(this.onMounted);
    },
    onMounted() {
        if (this.props.sh_is_refund_approve){
            $('.pay-order-button').prop( "disabled", true );
        }else{
            $('.pay-order-button').prop( "disabled", false );
        }
    }
})