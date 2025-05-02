/** @odoo-module */

import { PosOrder } from "@point_of_sale/app/models/pos_order";
import { PosOrderline } from "@point_of_sale/app/models/pos_order_line";

import { patch } from "@web/core/utils/patch";
import { PosStore } from "@point_of_sale/app/store/pos_store";

patch(PosStore.prototype, {
    async setup() {
        await super.setup(...arguments);
        this.data.connectWebSocket("CREATE_NOTE", (data) =>{ 

            console.log("datra", data , data.data);
            this.data.read("pre.define.note" ,[data.data])
            this.notification.add(
                "New record are created in order note please Refresh the page",
                3000
            );
        });
    },
});

patch(PosOrder.prototype, {
    set_note(note){
        this.sh_ordernote = note;
    },
    get_order_note (){
        return this.sh_ordernote
    },
    export_for_printing(baseUrl, headerData) {
        const result = super.export_for_printing(...arguments);
        console.log("this.sh_ordernote ", this.get_order_note() );
        
        result["order_note"] = this.get_order_note() 
        return result;
    },
})
patch(PosOrderline.prototype, {
    set_line_note(note){
        this.sh_line_note = note;
    },
    getDisplayData(){
        let res = super.getDisplayData()
        res["line_note"] = this.sh_line_note
        return res
    }
    
})