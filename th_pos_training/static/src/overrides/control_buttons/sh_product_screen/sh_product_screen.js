/** @odoo-module */
import { ControlButtons } from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";
import { patch } from "@web/core/utils/patch";
import { ask } from "@point_of_sale/app/store/make_awaitable_dialog";
import { sh_screen_popup } from "@th_pos_training/overrides/popups/sh_popup_screen/sh_popup_screen";

patch(ControlButtons.prototype,{
    open_pop_up(){
        console.log("123");
        this.dialog.add(sh_screen_popup,{
            product:1
        })
        // const confirmed = await ask(this.dialog, {
        //     title: "Test pop up",
        //     body: 
        //         "This is Test pop up"
        //     ,
        // });
        // if (confirmed) {
        //     console.log(confirmed);
        // }
    }
})