/** @odoo-module **/

import { _t } from "@web/core/l10n/translation";
import { useService } from "@web/core/utils/hooks";
import { Component } from "@odoo/owl";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { ControlButtons } from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";
import { patch } from "@web/core/utils/patch";
import {makeAwaitable,} from "@point_of_sale/app/store/make_awaitable_dialog";
import { PartnerList } from "@point_of_sale/app/screens/partner_list/partner_list";
import { AlertDialog } from "@web/core/confirmation_dialog/confirmation_dialog";


patch(ControlButtons.prototype, {

    setup() {
        super.setup(...arguments)
        this.dialog = useService("dialog");
        this.pos = usePos();
    },
    get partner_name(){
        const currentOrderline = this.pos.get_order().get_selected_orderline();
        if(currentOrderline){
            return currentOrderline.get_line_partner()
        }else{
            return  false
        }
    },
    async update_line_partner(){
        const  currentOrder = this.pos.get_order()
        const currentOrderline = this.pos.get_order().get_selected_orderline();
        if (!currentOrderline) {
            this.dialog.add(AlertDialog, {
                title: _t("Unvalid"),
                body: _t("Please, Select Orderline",),
            });
            return false
        }
        const currentPartner = currentOrderline.get_line_partner();
        if (currentPartner && currentOrder.getHasRefundLines()) {
            this.dialog.add(AlertDialog, {
                title: _t("Can't change customer"),
                body: _t(
                    "This order already has refund lines for %s. We can't change the customer associated to it. Create a new order for the new customer.",
                    currentPartner.name
                ),
            });
            return currentPartner;
        }
        const payload = await makeAwaitable(this.dialog, PartnerList, {
            partner: currentPartner,
            getPayload: (newPartner) => currentOrder.set_partner(newPartner),
        });

        if (payload) {
            currentOrderline.set_line_partner(payload);
        } else {
            currentOrderline.set_line_partner(false);
        }

        return currentPartner;
    }
})

