/** @odoo-module */
import { PaymentScreen } from "@point_of_sale/app/screens/payment_screen/payment_screen";
import { patch } from "@web/core/utils/patch";
import { sh_screen_payment_popup } from "@th_pos_training/overrides/popups/sh_payment_popup/sh_payment_popup";

patch(PaymentScreen.prototype,{
    open_pop_up(){
        console.log("123");
        this.dialog.add(sh_screen_payment_popup,{
            product:1
        })
        
    }
})