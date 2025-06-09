import { PosOrderline } from "@point_of_sale/app/models/pos_order_line";
import { patch } from "@web/core/utils/patch";
import { formatFloat, roundDecimals, roundPrecision, floatIsZero } from "@web/core/utils/numbers";

patch(PosOrderline.prototype, {
    can_be_merged_with(orderline) {
        let result = super.can_be_merged_with(orderline);
        if (result) {
            return result;
        } else {
            let same_product_tmpl = orderline.order_id.lines.filter(
                (line) => {
                    return (
                        line?.product_id.product_tmpl_id?.id ==
                        orderline?.product_id.product_tmpl_id?.id
                    );
                }
            );
            let quantity = same_product_tmpl.reduce(
                (sum, line) => sum + (line.qty || 0),
                0
            );
            let rules = orderline.product_id.getPricelistRule(
                orderline.order_id.pricelist_id,
                quantity
            );
            if (rules && rules.sh_enable_mixmatch_pricelist) {
                const productPriceUnit = this.models["decimal.precision"].find(
                    (dp) => dp.name === "Product Price"
                ).digits;
                const price = window.parseFloat(
                    roundDecimals(this.price_unit || 0, productPriceUnit).toFixed(productPriceUnit)
                );
                let order_line_price = orderline
                    .get_product()
                    .get_price(orderline.order_id.pricelist_id, quantity);
                order_line_price = roundDecimals(order_line_price, this.currency.decimal_places);
        
                const isSameCustomerNote =
                    (Boolean(orderline.get_customer_note()) === false &&
                        Boolean(this.get_customer_note()) === false) ||
                    orderline.get_customer_note() === this.get_customer_note();
        
                // only orderlines of the same product can be merged
                return (
                    !this.skip_change &&
                    orderline.getNote() === this.getNote() &&
                    this.get_product().id === orderline.get_product().id &&
                    this.is_pos_groupable() &&
                    // don't merge discounted orderlines
                    this.get_discount() === 0 &&
                    floatIsZero(
                        price - order_line_price - orderline.get_price_extra(),
                        this.currency.decimal_places
                    ) &&
                    !this.isLotTracked() &&
                    this.full_product_name === orderline.full_product_name &&
                    isSameCustomerNote &&
                    !this.refunded_orderline_id &&
                    !orderline.isPartOfCombo()
                );
            }
            else{
                return result
            }
        }
    },
});
