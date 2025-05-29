/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { PosStore } from "@point_of_sale/app/store/pos_store";
import { shUpdateBomPopup } from "@sh_pos_mrp_custom/apps/popups/sh_update_bom_popup/sh_update_bom_popup";
import { _t } from "@web/core/l10n/translation";
import { makeAwaitable } from "@point_of_sale/app/store/make_awaitable_dialog";
import { SelectionPopup } from "@point_of_sale/app/utils/input_popups/selection_popup";

patch(PosStore.prototype, {

    async setup() {
        await super.setup(...arguments);
        this.data.connectWebSocket("Update_MO_state", (message) => {
            let self = this;
            console.log("message -===>", message, message.id);
            self.data.read("pos.order.line", [message.id]);
        });

    },

    async addLineToCurrentOrder(vals, opts = {}, configure = true) {

        let order = this.get_order();
        if (!order) {
            order = this.add_new_order();
        }
        if (vals.product_id.bom_ids && vals.product_id.bom_ids.length) {

            var components_bom_ids = [];
            for (const bom_id of vals.product_id.bom_ids) {
                components_bom_ids.push({
                    id: bom_id.id,
                    label: bom_id.display_name,
                    isSelected: false,
                    item: bom_id,
                })
            }

            let components_bom_line_list = [];
            if (components_bom_ids.length > 1) {
                const selected_bom_record = await makeAwaitable(this.dialog, SelectionPopup, {
                    list: components_bom_ids,
                    title: _t("Select BOM"),
                });

                if (selected_bom_record) {
                    for (const item of selected_bom_record.bom_line_ids) {
                        components_bom_line_list.push(item)
                    }
                }

            } else if (components_bom_ids.length == 1) {
                for (const item of vals.product_id.bom_ids) {

                    for (const line of item.bom_line_ids) {

                        components_bom_line_list.push(line)
                    }
                }
            }
            var result = await super.addLineToCurrentOrder(...arguments)

            if (components_bom_line_list.filter(x => !x.product_id?.sh_is_raw_materil && !x.product_id?.available_in_pos).length > 0) {
                this.notification.add(
                    _t("componenet product not found"),
                    {
                        title: _t('Raw material not found !'),
                        type: "danger",
                    });
                
                return false
            }
            if (components_bom_line_list.length > 0) {
                let bompopups = await makeAwaitable(this.dialog, shUpdateBomPopup, {
                    product: vals.product_id,
                    sh_component_note: "",
                    components: components_bom_line_list
                });


                if (bompopups === undefined) {
                    return false
                }
                if (bompopups) {
                    var component_ids = Object.values(bompopups.payload.sh_component_ids)

                    // var component_price = 0.00
                    for (var i = 0; i < component_ids.length; i++) {
                        var com_id = component_ids[i]
                        var sh_product_id = bompopups.payload.sh_product_id[com_id]
                        var quantity = bompopups.payload.quantity[com_id]
                        var sh_product_uom = bompopups.payload.sh_product_uom[com_id]
                        sh_product_id = this.models["product.product"].get(sh_product_id);
                        sh_product_uom = this.models["uom.uom"].get(sh_product_uom)                        
                        var product_uom_category_id = this.models["uom.category"].filter((x) => x.id == sh_product_id.uom_id.id)
                        result.sh_component_note = bompopups.sh_component_note;
                        // const price = sh_product_id.get_price(
                        //     this.get_order().pricelist_id,
                        //     1,
                        // )
                        // component_price += (price * quantity)

                        var sh_data = {
                            "sh_product_id": sh_product_id,
                            "sh_product_qty": quantity,
                            'sh_initial_qty': quantity,
                            "sh_product_uom": sh_product_uom,
                            "product_uom_category_id": product_uom_category_id,
                            "sh_pos_order_line_id": result,
                        }
                        // const serializedOrder = sh_data.map((order) =>
                        //     order.serialize({ orm: true, clear: true })
                        // );

                        var sh_rec = await this.models['sh.pos.order.line.component'].create(sh_data)
                        console.log('sh_rec ---> ', sh_rec);


                        // result.sh_component_ids.push(data_created)
                    }

                    // const linePrice = result.price_unit
                    // result.sh_component_price  = linePrice + component_price
                    // result.set_unit_price(linePrice + component_price)
                    // result.price_type = 'manual';

                }
            }

            return result
        } else {
            return super.addLineToCurrentOrder(...arguments)
        }

    },
    async pay() {

        if (this.config.sh_default_invoice) {
            this.to_invoice = this.config.sh_default_invoice
        }

        var order_without_measurement = this.get_order().get_orderlines().filter((x) => (x.product_id?.bom_ids?.length && x.sh_measurement_line_ids.length == 0) || (x.product_id?.bom_ids?.length && x.sh_component_ids.length == 0))

        console.log(order_without_measurement);
        
        if (order_without_measurement && order_without_measurement.length){
            this.notification.add(
                _t("Please select the measurement of customer..."),
                {
                    title: _t('Select measurement for order'),
                    type: "danger",
                });
            return false
        }

        let is_mo = this.get_order().get_order_has_bom()
        if (this.config.enable_order_type && this.get_order() && !this.get_order().is_due_paid && this.get_order().get_total_with_tax() > 0 && is_mo.length) {
            if (!this.get_order().sh_order_type_id) {
                this.notification.add(
                    _t("Order type is not selected please select the order type to continue..."),
                    {
                        title: _t('Select order type !'),
                        type: "danger",
                    });
                return false
            } else {
                if (this.get_order().sh_order_type_id.is_home_delivery && !this.get_order().get_partner() && this.config.enable_order_type) {
                    this.notification.add(
                        _t("Please select the customer for delivery order..."),
                        {
                            title: _t('Select customer for delivery order !'),
                            type: "success",
                        });
    
                    const { confirmed, payload: newPartner } = await this.showTempScreen("PartnerListScreen");
                    if (confirmed) {
                        this.get_order().set_partner(newPartner);
                        this.get_order().updatePricelistAndFiscalPosition(newPartner);
                    }
                    return false
                } else {
                    if (!this.get_order().get_partner()) {
                        this.notification.add(
                            _t("Please select the customer for order..."),
                            {
                                title: _t('Select customer for order'),
                                type: "danger",
                            });
                        return false
                    }
                }
            }
        }

        super.pay()
    },
    sh_send_notification(type, title, message) {
        if (this.notification) {
            this.notification.add(message, { type: type, title: title, sticky: true }, 5000);
        }
    },

})