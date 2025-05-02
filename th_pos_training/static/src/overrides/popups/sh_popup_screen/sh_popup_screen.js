/** @odoo-module */
import { Component } from "@odoo/owl";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { Dialog } from "@web/core/dialog/dialog";


export class sh_screen_popup extends Component{
    static template = "th_pos_training.sh_pop_screen";
    static components = { Dialog };

    setup(){
        super.setup()
        this.pos = usePos();
    }

    get all_order_note(){
        return this.pos.models["sh.order.note"].getAll()
        
    }

    set_order_note(note){
        // print()
        // console.log("===========>",this.pos.get_order().lines);
        
        // print("=========>",this.pos.get_orderlines())
        this.pos.get_order().set_note_order(note)
        const orderlines=this.pos.get_order().get_orderlines()
        // for (let orderline = 0; orderline < orderlines.length; orderline++) {
        //     const element = orderlines[orderline];
        //     element.set_note_order_line(note)
        //     console.log("=========>",element);
        // }
        orderlines.forEach(orderline => {
            orderline.set_note_order_line(note)
            console.log("==========>",orderline);
            
        });
    }

}