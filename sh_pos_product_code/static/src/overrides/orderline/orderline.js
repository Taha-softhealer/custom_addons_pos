import { Orderline } from "@point_of_sale/app/generic_components/orderline/orderline";
import { PosOrderline } from "@point_of_sale/app/models/pos_order_line";
import { patch } from "@web/core/utils/patch";

patch(PosOrderline.prototype, {
    getDisplayData() {
        return {
            ...super.getDisplayData(),
            default_code: this.product_id.default_code || "",
            sh_enable_product_internal_ref_cart: this.config.sh_enable_product_internal_ref_cart || false,
        };
    },
});

patch(Orderline, {
    props: {
        ...Orderline.props,
        line: {
            ...Orderline.props.line,
            shape: {
                ...Orderline.props.line.shape,
                sh_enable_product_internal_ref_cart: {
                    type: Boolean,
                    optional: true,
                },
                default_code: { type: String, optional: true },
            },
        },
    },
});
