/** @odoo-module */

import { PaymentScreen } from "@point_of_sale/app/screens/payment_screen/payment_screen";
import { patch } from "@web/core/utils/patch";
import {ErrorPopup} from "@point_of_sale/app/errors/popups/error_popup";
import { _t } from "@web/core/l10n/translation";


patch(PaymentScreen.prototype, {
    async validateOrder(isForceValidate) {
        var self = this;
        var order = this.currentOrder;
        
        // partial payment flow
        if (this.pos.config.enable_partial_payment && !this.pos?.get_order()?.is_paid()) {
            alert(this.pos.get_order().get_partner().name + " is not allow to do partial payment.")
        } else if (this.pos.config.enable_partial_payment && !this.pos.get_order().to_invoice && this.pos.get_order().get_partner() && !this.pos.get_order().get_partner().not_allow_partial_payment && !this.pos.get_order().is_paid()) {
            alert("You can not do a partial payment without invoice.")
        }

        let total_paid;
        if (this.paymentLines && this.paymentLines.length && (!('backendId' in order) || order.backendId === undefined ) ){
            total_paid = order.get_total_paid()
            var total_order_amount = parseFloat(order.get_total_with_tax().toFixed(2))
            
            var amount_50_pre = (total_order_amount * 50 )/ 100 
            if (order.get_total_with_tax() > 0 && !('is_due_paid' in order)){
                if ( order.get_order_type() &&  order.get_order_type().pickup_from_other_branch && (total_paid != total_order_amount)){
                    await self.popup.add(ErrorPopup, {
                        title: _t(" Payment Restriction "),
                        body: _t("Full Payment Required for Order ! "),
                    });
                    
                    return false
                }else if( total_paid < amount_50_pre ){
                    await self.popup.add(ErrorPopup, {
                        title: _t(" Payment Restriction "),
                        body: _t("Required 50% amount for order"),
                    });
                    return false
                }else{
                    var mrp_order_details = []
                    for (let line of order.get_orderlines()){
                        if ( line.get_bom_details() && line.get_bom_details().product_id ){
                            let dic_new = line.get_bom_details()
                            dic_new['product_qty'] = line.quantity
                            mrp_order_details.push(dic_new)
                        }
                    }
                    if (mrp_order_details && mrp_order_details.length){
                       order.set_order_bom_details(mrp_order_details)
                    }
                }
            }
        }
        await super.validateOrder(...arguments);
    },
    addNewPaymentLine(paymentMethod) {
        // original function: click_paymentmethods
        const result = this.currentOrder.add_paymentline(paymentMethod);
        if (result == "Warning"){
            this.popup.add(ErrorPopup, {
                title: _t("Amount Warning"),
                body: _t("There is No Amount For Payment"),
            });
            return false;
        }
        if (result) {
            this.numberBuffer.reset();
            return true;
        } else {
            this.popup.add(ErrorPopup, {
                title: _t("Error"),
                body: _t("There is already an electronic payment in progress."),
            });
            return false;
        }
    }
});
