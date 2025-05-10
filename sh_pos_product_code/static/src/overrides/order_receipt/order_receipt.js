import { patch } from "@web/core/utils/patch";
import { PosOrder } from "@point_of_sale/app/models/pos_order";
import { omit } from "@web/core/utils/objects";


patch(PosOrder.prototype, {
    export_for_printing(baseUrl, headerData) {
        const result = super.export_for_printing(...arguments);
        // let lines=result.orderlines
        // console.log(lines);
        console.log("===before===>",result);
        
        if (this.config.sh_enable_product_internal_ref_receipt) {
            result.orderlines.map((line)=>omit(line,"default_code"))
        }
        console.log("===after===>",result);
        

        return result;
    },
});
