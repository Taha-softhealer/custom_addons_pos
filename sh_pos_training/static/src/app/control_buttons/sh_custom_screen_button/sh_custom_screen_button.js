/** @odoo-module */


import { ControlButtons } from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";
import { patch } from "@web/core/utils/patch";
import { custom_popup } from "@sh_pos_training/app/popups/sh_screen_popup/sh_screen_popup"
import { custom_screen } from "@sh_pos_training/app/custom_screen/custom_screen"

patch(ControlButtons.prototype,{
    async sh_open_custom_popup(){
        // alert("123456")
        let products = [{"id" : 1,"name" : "product1"},{"id" : 2,"name" : "product2"}]
        this.dialog.add(custom_popup, {
            title: ("Printing is not supported on some browsers"),
            body: ("It is possible to print your tickets by making use of an IoT Box."),
            product : products
        });
    },
    sh_open_custom_screen(){
        this.pos.showScreen("custom_screen")
    }
})