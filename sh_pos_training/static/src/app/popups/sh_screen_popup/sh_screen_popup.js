/** @odoo-module */

import { _t } from "@web/core/l10n/translation";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { Dialog } from "@web/core/dialog/dialog";
import { Component, useState } from "@odoo/owl";

export class custom_popup extends Component {

    static template = "sh_pos_training.custom_popup";
    static components = {  Dialog };

    setup(){
        super.setup()
        this.pos =  usePos()
        
    }
    get all_order_note(){
        console.log("this 12", this);
        return this.pos.models["pre.define.note"].getAllBy("id");
    }
    set_order_note(note){
        this.pos.get_order().set_note(note)
        let lines = this.pos.get_order().get_orderlines()
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            line.set_line_note(note)
        }
    }
}
