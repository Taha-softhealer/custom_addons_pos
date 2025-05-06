/** @odoo-module */

import { usePos } from "@point_of_sale/app/store/pos_hook";
// import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { _t } from "@web/core/l10n/translation";
// import { MeasurementPopup } from "@sh_pos_mrp_custom/apps/popups/MesurementPopup/MesurementPopup";
import { MeasurementSelectionPopup } from "@sh_pos_mrp_custom/apps/popups/MeasurementSelectionPopup/MeasurementSelectionPopup";
import { useService } from "@web/core/utils/hooks";
import { ControlButtons } from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";
import { patch } from "@web/core/utils/patch";
import { MeasurementPopup } from "@sh_pos_mrp_custom/apps/popups/MesurementPopup/MesurementPopup";
import { makeAwaitable, makeActionAwaitable } from "@point_of_sale/app/store/make_awaitable_dialog";
import { AlertDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { shUpdateBomPopup2 } from "@sh_pos_mrp_custom/apps/popups/sh_update_bom_component_2/sh_update_bom_popup";

patch(ControlButtons.prototype, {

    setup() {
        super.setup(...arguments)
        this.dialog = useService("dialog");
        this.pos = usePos();
        this.orm = useService("orm");
        this.action = useService("action");

    },
    async onClickMeasurementButton() {
        var self = this;
        var selectionList = []
        var order = this.pos.get_order()
        var selected_orderline = order.get_selected_orderline()
        var partner = selected_orderline ? selected_orderline.get_line_partner() : false
        if (partner && order) {
            for (let measurement_id of partner.sh_measurement_ids) {
                var dict = {
                    id: measurement_id.id,
                    label: measurement_id.name,
                    isSelected: order.get_selected_orderline()?.sh_measurement_id && measurement_id.id === order.get_selected_orderline()?.sh_measurement_id?.id,
                    item: measurement_id,
                }
                selectionList.push(dict)
            }
            const selectedMeasurement = await makeAwaitable(this.dialog, MeasurementSelectionPopup, {
                list: selectionList,
                title: _t("Select the Measurement"),
            });
            let new_measurement = await self.open_measurment_dailog(selectedMeasurement)
            console.log('new_measurement', new_measurement);

            if (new_measurement) {

                if (order.get_selected_orderline()) {
                    var shmeasurement_obj = await self.pos.data.read('sh.measurement', [new_measurement.id])

                    order.get_selected_orderline().sh_measurement_id = shmeasurement_obj[0]
                    for (let i = 0; i < new_measurement?.sh_measurement_line_ids.length; i++) {
                        const mes_id = new_measurement?.sh_measurement_line_ids[i];
                        const mes = await this.pos.data.call("sh.measurement.line", 'read', [mes_id]);
                        var rec = mes[0]

                        var measurement_type_obj = self.pos.models['sh.measurement.type'].get(rec?.sh_measurement_type_id[0])
                        var measurement_categ_obj = self.pos.models['sh.measurement.type'].get(new_measurement?.category_id[0])
                        var uom_obj = self.pos.models['uom.uom'].get(rec?.sh_uom_id[0])

                        
                        var new_mes_dic = {
                            size_1: rec.size_1,
                            size_2: rec.size_2,
                            size_3: rec.size_3,
                            size_4: rec.size_4,
                            size_5: rec.size_5,
                            size_6: rec.size_6,
                            size_7: rec.size_7,
                            size_8: rec.size_8,
                            size_9: rec.size_9,
                            size_10: rec.size_10,
                            sh_uom_id: uom_obj,
                            employee_id: rec.employee_id,
                            display_name: rec.display_name,
                            'category_id': measurement_categ_obj,
                            sh_measurement_type_id: measurement_type_obj,
                            sh_measurement_line_id: order.get_selected_orderline()
                        }

                        var lineObj = await self.pos.models['sh.pos.order.line.measurement'].create(new_mes_dic)
                        console.log('\n\n lineObj ===> ', lineObj);

                    }

                }
                if (selectedMeasurement !== "create_new_record") {
                    this.notification.add(
                        _t("Measurement Edited and Set too Order..."),
                        {
                            title: _t('Measurement !'),
                            type: "success",
                        });
                } else {
                    // if (order.get_selected_orderline()) {
                    //     order.get_selected_orderline().set_line_measurement(new_measurement)
                    // }
                    this.notification.add(
                        _t("Measurement Created and Set too Order..."),
                        {
                            title: _t('Measurement !'),
                            type: "success",
                        });
                }
            }
        }
    },
    async open_measurment_dailog(measurment) {
        var self = this;
        var order = this.pos.get_order()
        var partner = order ? order.get_partner() : false
        var selected_orderline = order.get_selected_orderline()
        var partner = selected_orderline ? selected_orderline.get_line_partner() : false

        if (measurment) {
            const record = await makeActionAwaitable(this.action,
                "sh_pos_mrp_custom.sh_measurement_action_edit_pos",
                {
                    props: measurment !== "create_new_record" ? { resId: measurment?.id } : {},
                    additionalContext: { sh_partner_id: partner.id },
                    onClose: async (record) => {
                        console.log('onClose',record);
                        
                        if(record){
                            if(self.pos.get_order() && self.pos.get_order().get_selected_orderline()){
                                var orderline = self.pos.get_order().get_selected_orderline();
                                var sh_bom_componetns = orderline.sh_component_ids
                    
                                let bompopups = await makeAwaitable(self.dialog, shUpdateBomPopup2, {
                                    sh_component_note : self.pos.get_order().get_selected_orderline().sh_component_note,
                                    components : sh_bom_componetns,
                                    'continue': true,
                                    selected_measurement: measurment,
                                    partner: partner
                                });
                    
                    
                                if (bompopups) {
                                    
                                    for (const elm of orderline.sh_component_ids) {
                                        var sh_product_id = self.pos.models["product.product"].get(bompopups.payload.sh_product_id[elm.id]);
                                        var sh_product_uom = self.pos.models["uom.uom"].get(bompopups.payload.sh_product_uom[elm.id])
                                        var sh_product_uom_category_id = self.pos.models["uom.category"].get(sh_product_id)
                                        console.log('sh_product_id -----> ',sh_product_id);
                                        
                                        if ( elm && typeof(elm.id) === "number" ){
                                            let component_dict = {
                                                "sh_product_id" : sh_product_id,
                                                "sh_product_qty" : bompopups.payload.quantity[elm.id],
                                                "sh_product_uom" : sh_product_uom,
                                                'sh_initial_qty': sh_product_uom,
                                                "product_uom_category_id" : sh_product_uom_category_id,
                                                "sh_pos_order_line_id" : self.pos.get_order().get_selected_orderline()
                                            }
                                            var data = await self.pos.models['sh.pos.order.line.component'].create(component_dict) 
                                            
                                        }else if ( elm && typeof(elm.id) === "string") {
                                            console.log("Outside the NUmber");
                                            
                                       
                                            // var sh_product_uom_category_id = this.pos.models
                                            // console.log("Befor Quenty ",elm.sh_product_qty);
                                            elm.sh_product_qty = bompopups.payload.quantity[elm.id]
                                            // console.log("After Quenty ",elm.sh_product_qty);
                            
                                            // console.log("Before UOM : ",elm.sh_product_uom)
                                            elm.sh_product_uom = sh_product_uom;
                                            // console.log("After UOM : ",elm.sh_product_uom)
                            
                                            // console.log("Before Product Id",elm.sh_product_id)
                                            elm.sh_product_id = sh_product_id;
                                            // console.log("After Product Id",elm.sh_product_id)
                        
                                            elm.product_uom_category_id = sh_product_uom_category_id
                        
                            
                                            // console.log('\nelm ==========================================>\n')
                                            console.log(elm);
                                        }
                                    }
                                    orderline.sh_component_ids = orderline.sh_component_ids.filter((x) => x.id != 0)
                                    
                                }
                            }
                        }
                    },
                },
            );
            console.log('record ===>', record);

            if (measurment !== "create_new_record") {
                const updated_record = await this.pos.data.call("sh.measurement", 'read', record.config.resIds);

                // const updated_record = await this.pos.data.read("sh.measurement", record.config.resIds);

                // return updated_record[0]

                return updated_record[0]
            } else {
                const updated_record = await this.pos.data.call("sh.measurement", 'read', [record.resId]);

                return updated_record[0]
            }
        }
    },

}



)
