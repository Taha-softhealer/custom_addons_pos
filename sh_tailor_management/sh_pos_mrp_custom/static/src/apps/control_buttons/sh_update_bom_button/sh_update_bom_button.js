/** @odoo-module */

import { usePos } from "@point_of_sale/app/store/pos_hook";
import { useService } from "@web/core/utils/hooks";
import { ControlButtons } from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";
import { patch } from "@web/core/utils/patch";
import { shUpdateBomPopup } from "@sh_pos_mrp_custom/apps/popups/sh_update_bom_popup/sh_update_bom_popup";
import { makeAwaitable } from "@point_of_sale/app/store/make_awaitable_dialog";
import { shUpdateBomPopup2 } from "@sh_pos_mrp_custom/apps/popups/sh_update_bom_component_2/sh_update_bom_popup";
patch(ControlButtons.prototype, { 

    setup() {
        super.setup(...arguments)
        this.dialog = useService("dialog");
        this.pos = usePos();
    },
    async UpdateBOM(){
        var self = this;
        if(this.pos.get_order() && this.pos.get_order().get_selected_orderline()){
            var orderline = this.pos.get_order().get_selected_orderline();
            var sh_bom_componetns = orderline.sh_component_ids
            console.log(sh_bom_componetns);

            let bompopups = await makeAwaitable(this.dialog, shUpdateBomPopup2, {
                sh_component_note : this.pos.get_order().get_selected_orderline().sh_component_note,
                components : sh_bom_componetns
            });


            if (bompopups) {
                
                for (const elm of orderline.sh_component_ids) {
                    var sh_product_id = this.pos.models["product.product"].get(bompopups.payload.sh_product_id[elm.id]);
                    var sh_product_uom = this.pos.models["uom.uom"].get(bompopups.payload.sh_product_uom[elm.id])
                    var sh_product_uom_category_id = this.pos.models["uom.category"].get(sh_product_id)
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
        else{
            this.notification.add(
                "Please make a order and select customer for orderline",
            {
                type: "warning",
                title: "Couldn't open measurment"
            }
        );
        }
    }
}   )

