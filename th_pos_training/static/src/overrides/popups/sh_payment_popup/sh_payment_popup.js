/** @odoo-module */
import { Component } from "@odoo/owl";
import { Dialog } from "@web/core/dialog/dialog";


export class sh_screen_payment_popup extends Component{
    static template = "th_pos_training.sh_payment_pop_up";
    static components = { Dialog };

    setup(){
        super.setup()
    }

    confirm() {
        // super.confirm()
        console.log("897456213");
        this.props.close();
    }
    close(){
        console.log("asdfgh");
        this.props.close();
    }
}