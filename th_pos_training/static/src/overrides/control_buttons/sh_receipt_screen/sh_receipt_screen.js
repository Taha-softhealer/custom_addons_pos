/** @odoo-module */
import { ReceiptScreen } from "@point_of_sale/app/screens/receipt_screen/receipt_screen";
import { patch } from "@web/core/utils/patch";
import { sh_screen_popup } from "@th_pos_training/overrides/popups/sh_popup_screen/sh_popup_screen";

patch(ReceiptScreen.prototype,{
    open_pop_up(){
        console.log("123");
        this.dialog.add(sh_screen_popup,{
            product:1
        })
        
    }
})