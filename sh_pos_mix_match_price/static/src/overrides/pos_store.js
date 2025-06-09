/** @odoo-module */

import { PosStore } from "@point_of_sale/app/store/pos_store";
import { patch } from "@web/core/utils/patch";

patch(PosStore.prototype, {
    async addLineToOrder(vals, order, opts = {}, configure = true) {
        let result = await super.addLineToOrder(
            vals,
            order,
            (opts = {}),
            (configure = true)
        );
        let rules;
        let lines = order.get_orderlines();
        let selectedLine = order.get_selected_orderline();
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
        rules = vals.product_id.getPricelistRule(order.pricelist_id, quantity);
        if (rules && rules.sh_enable_mixmatch_pricelist) {
            same_product_tmpl.forEach((line) => {
                line.price_unit = line.product_id.get_price(
                    order.pricelist_id,
                    quantity
                );
            });
        }
        return result;
    },
});
