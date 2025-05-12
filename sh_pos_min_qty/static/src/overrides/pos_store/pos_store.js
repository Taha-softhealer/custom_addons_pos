import { PosStore } from "@point_of_sale/app/store/pos_store";
import { patch } from "@web/core/utils/patch";

patch(PosStore.prototype,{
    async addLineToOrder(vals, order, opts = {}, configure = true) {
        let addedinline=false
        let lines=order.lines
        console.log("vals",vals.product_id.id);
        // console.log("lines",lines);
        // for (let index = 0; index < lines.length; index++) {
        //     const line = lines[index];
        //     if(line.product_id.id){
        //         addedinline=true
        //     }
        // }
        if (this.config.sh_enable_pos_min_qty) {
            vals.qty=vals.product_id.sh_min_qty
        }
        console.log(vals);
        let result=super.addLineToOrder(vals, order, opts = {}, configure = true)
        return result
    }
})