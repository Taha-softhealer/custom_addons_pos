import { patch } from "@web/core/utils/patch";
import { PosOrder } from "@point_of_sale/app/models/pos_order";

patch(PosOrder.prototype, {
    export_for_printing(baseUrl, headerData) {
        let total_qty = 0;
        const result = super.export_for_printing(...arguments);
        this.getSortedOrderlines().map((l) => (total_qty += l.qty)),

        result["total_item"] = this.config.sh_enable_total_item_receipt ? this.getSortedOrderlines().length : false;
        result["total_qty"] = this.config.sh_enable_total_qty_receipt ? total_qty : false;
        return result;
    },
});
