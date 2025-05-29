import { OrderSummary } from "@point_of_sale/app/screens/product_screen/order_summary/order_summary";
import { patch } from "@web/core/utils/patch";

patch(OrderSummary.prototype, {

    async _setValue(val) {
        let happy_hours_id = this.pos.config.sh_happy_hours_id;
        let result = await super._setValue(val);

        if (happy_hours_id && this.pos.sh_sale_hours()) {
            console.log("udgik");
            
            if (val != "remove" && val != "") {
                await this.pos.sh_check_quantity();
            } else if (val == "" || val == "remove") {
                await this.pos.sh_update_reward_qty();
            }
        }
        return result;
    },
});
