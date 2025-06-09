import { OrderSummary } from "@point_of_sale/app/screens/product_screen/order_summary/order_summary";
import { patch } from "@web/core/utils/patch";

patch(OrderSummary.prototype, {

    async _setValue(val) {
        let rules
        let result = await super._setValue(val);
        let selectedLine = this.currentOrder.get_selected_orderline();
        let lines = this.currentOrder.get_orderlines();
        let same_product_tmpl = [];
        let quantity = 0;

        if (lines.length && selectedLine) {
            same_product_tmpl = lines.filter((line) => {
                return (
                    line?.product_id.product_tmpl_id?.id ==
                    selectedLine?.product_id.product_tmpl_id?.id
                );
            });
        }

        quantity = same_product_tmpl.reduce(
            (sum, line) => sum + (line.qty || 0),
            0
        );
        
        rules = selectedLine?.product_id.getPricelistRule(this.currentOrder.pricelist_id, quantity);

            same_product_tmpl.forEach((line) => {
                line.price_unit = line.product_id.get_price(
                    this.currentOrder.pricelist_id,
                    quantity
                );
            });
        return result;
    },
});
