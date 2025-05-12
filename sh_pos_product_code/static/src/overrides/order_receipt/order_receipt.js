import { patch } from "@web/core/utils/patch";
import { PosOrder } from "@point_of_sale/app/models/pos_order";
import { omit } from "@web/core/utils/objects";


patch(PosOrder.prototype, {
    export_for_printing(baseUrl, headerData) {
        const result = super.export_for_printing(...arguments);
        
        if (!this.config.sh_enable_product_internal_ref_receipt) { 
            result["orderlines"]= this.getSortedOrderlines().map((l) =>
                omit(l.getDisplayData(), "internalNote","sh_enable_product_internal_ref_cart"),
            )
        }
        return result;
    },
});
