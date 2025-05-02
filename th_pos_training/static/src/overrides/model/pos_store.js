/** @odoo-module */

import { PosOrder } from "@point_of_sale/app/models/pos_order";
import { PosOrderline } from "@point_of_sale/app/models/pos_order_line";
import { patch } from "@web/core/utils/patch";

patch(PosOrder.prototype, {
    set_note_order(note){
        this.sh_order_note = note;
    },
})

patch(PosOrderline.prototype,{
    set_note_order_line(note){
        console.log("===========calling orderline=========>",note);
        this.sh_order_note=note;
    }
})