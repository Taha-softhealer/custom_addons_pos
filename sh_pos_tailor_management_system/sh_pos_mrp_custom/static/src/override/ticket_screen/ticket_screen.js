/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { TicketScreen } from "@point_of_sale/app/screens/ticket_screen/ticket_screen";
import { parseFloat as oParseFloat } from "@web/views/fields/parsers";

patch(TicketScreen.prototype, {

    onClickOrder(clickedOrder) {
        super.onClickOrder(...arguments)

        setTimeout(() => {
            $('.sh_fitting_box').hide()
            if ( clickedOrder.sh_invoice_paid_amount && clickedOrder.sh_invoice_paid_amount > 0 ){
                if (clickedOrder.sh_is_refund_approve){
                    $('.pay-order-button').prop( "disabled", false );
                }else{
                    $('.pay-order-button').prop( "disabled", true );
                }
            }
        }, 10);
    },

    async onDoRefund() {
        super.onDoRefund()
        var selected_order = this.getSelectedOrder();
        var order = this.pos.get_order();

        order.set_order_type(selected_order.get_order_type() ? selected_order.get_order_type() : null )
    }
})