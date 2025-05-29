/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { PosOrderline } from "@point_of_sale/app/models/pos_order_line";
import { PosOrder } from "@point_of_sale/app/models/pos_order";

patch(PosOrderline.prototype, {

    setup() {
        this.sh_component_ids = this.sh_component_ids
        this.sh_component_price = 0.00
        this.core_componenet = this.core_componenet ||  '';
        this.sh_line_measurement = this.sh_line_measurement || {};
        this.bom_details = this.bom_details || {};
        this.sh_measurement_line_ids = this.sh_measurement_line_ids || [];
        this.sh_is_onhold = false;
        this.sh_parent_order_line_uuid = "";
        return super.setup(...arguments);
    },
    set_line_partner(partner){
        this.sh_partner_id =  partner
    },
    get_line_partner(){
        return this.sh_partner_id
    },
    set_core_componenet(core_componenet) {
        this['core_componenet'] = core_componenet
    },
    set_bom_details(bom_details) {
        this.bom_details = bom_details
    },
    get_bom_details() {
        return this.bom_details
    },
    set_parenet_line_id(uuid) {
        this.sh_parent_order_line_uuid = uuid
    },
    set_fitting(fitting) {
        this.sh_is_fitting = fitting
    },
    set_onhold(sh_is_onhold) {
        this.sh_is_onhold = sh_is_onhold
    },
    get_line_measurement() {
        return this.sh_line_measurement
    },
    set_line_measurement(measurement) {
        this.sh_line_measurement = measurement
    },
    set_quantity(quantity, keep_price) {
        const res = super.set_quantity(quantity, keep_price);
        const quant = typeof quantity === "number" ? quantity : parseFloat("" + (quantity ? quantity : 0));
        console.log('>>quant>',quant );

        if (this.sh_component_ids && this.sh_component_ids.length){
            for (let i = 0; i < this.sh_component_ids.length; i++) {
                const sh_component = this.sh_component_ids[i];
                const sh_qty = typeof sh_component.sh_initial_qty === "number" ? sh_component.sh_initial_qty : parseFloat("" + (sh_component.sh_initial_qty ? sh_component.sh_initial_qty : 0));
                
                sh_component.update({
                    sh_product_qty: sh_qty * quant
                })
                
            }
        }
        // if (this.sh_component_price){
        //     this.set_unit_price(this.sh_component_price)
        // }
        
        return res
    },
    can_be_merged_with(orderline) {
        var result = super.can_be_merged_with(...arguments)
        function compareArrays(arr1, arr2) {
            return JSON.stringify(arr1) === JSON.stringify(arr2);
        }
        if (this.sh_component_ids && orderline.sh_component_ids && !compareArrays(this.sh_component_ids.length, orderline.bom_details.length)) {
            return false
        } else {
            return result
        }

    },
    getDisplayData() {
        var self = this;
        let sh_parent_product;
        if (this.sh_parent_order_line_uuid) {
            sh_parent_product = this.order.orderlines.find((line) => line.uuid === self.sh_parent_order_line_uuid);
        }
        return {
            ...super.getDisplayData(),
            sh_is_fitting: this.sh_is_fitting,
            sh_is_onhold: this.sh_is_onhold,
            sh_order_finalized: this.order_id.finalized,
            measurement_name: this.sh_measurement_id ? this.sh_measurement_id?.name: '',
            fitting_in_cart: this.order_id && !this.order_id.finalized,
            sh_parent_product: sh_parent_product ? sh_parent_product.full_product_name : '' && !this.order_id.finalized,
            line_id: self?.id || false
        };
    }
})

patch(PosOrder.prototype, {
    get_order_has_bom(){
        return this.get_orderlines().filter((line) => line.product_id.bom_ids.length > 0 )
    },
//     setup() {
//         super.setup(...arguments);
//         this.selected_measurement = this.selected_measurement || false;
//         this.bom_details = this.bom_details || [];
//         // this.to_invoice = this.pos.config.sh_default_invoice
//         this.save_to_db();
//     },

    
//     init_from_JSON(json) {
//         super.init_from_JSON(...arguments);
//         this.bom_details = json.bom_details;
//         this.sh_is_refund_approve = json.sh_is_refund_approve || false
//     },
//     get_order_bom_details() {
//         return this.bom_details
//     },
//     set_order_bom_details(bom_details) {
//         this.bom_details = bom_details
//     },
//     get_selected_measurement() {
//         return this.selected_measurement
//     },
//     set_selected_measurement(measurement) {
//         this.selected_measurement = measurement
//     },
//     //@override
//     export_as_JSON() {
//         const json = super.export_as_JSON(...arguments);
//         if (this.get_order_bom_details() && this.get_order_bom_details().length) {
//             json.bom_details = this.get_order_bom_details();
//         }

//         return json;
//     },
//     async add_product(product, options) {
//         var self = this;
//         if (product && product.bom_ids && product.bom_ids.length > 0 && !("refunded_orderline_id" in options)) {
//             const each_bom = this.pos.bom_by_id[product.bom_ids[0]]

//             const { confirmed, payload } = await this.pos.popup.add(shUpdateBomPopup, { "product": product, 'bum_qty': (each_bom.product_qty), 'components': each_bom.bom_line_ids, units: this.pos.units, 'sh_require_fabric': each_bom.sh_require_fabric, 'sh_component_note': '' })

//             if (confirmed) {
//                 // Set bom details to order line
//                 if (options['extras']) {
//                     options['extras']['bom_details'] = payload
//                 } else {
//                     if (payload.bom_line_ids && payload.bom_line_ids.length) {
//                         options['extras'] = { 'bom_details': payload, 'core_componenet': JSON.stringify(payload.bom_line_ids) }
//                     }
//                 }
//                 await super.add_product(...arguments);
//             }

//         } else {
//             await super.add_product(...arguments);
//         }

//         // await super.add_product(...arguments);

//     },
//     add_paymentline(payment_method) {
//         this.assert_editable();
//         if (this.electronic_payment_in_progress()) {
//             return false;
//         } else {
//             if (this.get_due() == 0){
//                 return "Warning";
//             }
//             var newPaymentline = new Payment(
//                 { env: this.env },
//                 { order: this, payment_method: payment_method, pos: this.pos }
//             );
//             this.paymentlines.add(newPaymentline);
//             this.select_paymentline(newPaymentline);
//             if (this.pos.config.cash_rounding) {
//                 this.selected_paymentline.set_amount(0);
//             }
//             newPaymentline.set_amount(this.get_due());

//             if (payment_method.payment_terminal) {
//                 newPaymentline.set_payment_status("pending");
//             }
//             return newPaymentline;
//         }
//     }
})