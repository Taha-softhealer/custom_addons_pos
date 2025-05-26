import { OrderSummary } from "@point_of_sale/app/screens/product_screen/order_summary/order_summary";
import { patch } from "@web/core/utils/patch";

patch(OrderSummary.prototype, {
    async _setValue(val) {
        let result = await super._setValue(val);
        console.log("this is from setrvalue", val);
        if (val != "remove" && val != "") {
            await this.pos.sh_check_quantity();
        } else if (val == "" || val == "remove") {
            await this.pos.UpdaterewardQty();
        }

        return result;
    },
});
