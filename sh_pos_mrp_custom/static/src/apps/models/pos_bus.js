/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { PosBus } from "@point_of_sale/app/bus/pos_bus_service";
import { useService } from "@web/core/utils/hooks";
import { _t } from "@web/core/l10n/translation";

patch(PosBus.prototype, {
    setup(env, { pos, orm, bus_service }) {
        super.setup(...arguments)
    },
    dispatch(message) {
        super.dispatch(...arguments);
        if (message && message.type == "sh_delivery_state_update"){
            let notification = message.payload
            var pos_order = this.pos.db.pos_order_by_id[notification.pos_order_id]
            if (pos_order) {
                pos_order[0]['sh_delivery_state'] = notification.delivery_state
            }
        }
        if (message && message.type == "sh_pos_line_current_production_update"){
            let notification = message.payload
            var pos = this.pos;

            var pos_order = pos.db.pos_order_by_id[notification.pos_order_id]
            if (pos_order){
                pos_order[1] = notification.pos_order_line_vals
            }
        }

        if (message && message.type == "sh_production_refund_approved"){
            this.pos.sh_send_notification('success', 'Refund Request !',"Refund Request Approved")
        }else if (message && message.type == "sh_production_refund_rejected") {
            this.pos.sh_send_notification('danger', 'Refund Request !',"Refund Request Rejected ")
        }
    },

})