import { Orderline } from "@point_of_sale/app/generic_components/orderline/orderline";
import { PosOrderline } from "@point_of_sale/app/models/pos_order_line";
import { ask } from "@point_of_sale/app/store/make_awaitable_dialog";
import { patch } from "@web/core/utils/patch";
import { OrderSummary } from "@point_of_sale/app/screens/product_screen/order_summary/order_summary";
import { PosStore } from "@point_of_sale/app/store/pos_store";

patch(Orderline, {
    props: {
        ...Orderline.props,
        group_pos_product_min_max_price: { type: Boolean, optional: true },
        line: {
            ...Orderline.props.line,
            shape: {
                ...Orderline.props.line.shape,
                sh_price_min: { type: Number, optional: true },
                sh_price_max: { type: Number, optional: true },
            },
        },
    },
});


patch(PosStore.prototype, {
    async pay() {
        const currentOrder = this.get_order();
        const lines = currentOrder.lines;
        let popup = false;
        lines.forEach((line) => {
            console.log(line);
            
            
        });

        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            
            if (!this.config.group_allow_confirm_pos_product_sale_price &
                this.config.group_pos_product_min_max_price &
                line.product_id.sh_min_price > line.price_unit |
                line.price_unit > line.product_id.sh_max_price
            ) {
                const response = ask(this.dialog, {
                    title: "Product Price Alert",
                    body: "Sale Price of " + line.full_product_name + " should between " + line.product_id.sh_min_price +" - "+ line.product_id.sh_max_price,
                });
                popup = true;
                break
            }
        }
        if (!popup) {
            super.pay();
        }
    },
});
