/** @odoo-module */

import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { patch } from "@web/core/utils/patch";
import { SetSaleOrderButton } from "@pos_sale/app/set_sale_order_button/set_sale_order_button";
import { onMounted } from "@odoo/owl";


patch(SetSaleOrderButton.prototype, {
    setup() {
        super.setup(...arguments)
        onMounted(async () => {
            $('.o_sale_order_button').hide()
        });
    }
})
