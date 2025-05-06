/** @odoo-module */

import { Component, useState, useRef, onMounted } from "@odoo/owl";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { useService } from "@web/core/utils/hooks";
import { renderToElement } from "@web/core/utils/render";


export class BomAddLineComponent extends Component{
    static template = "sh_pos_mrp_custom.BomAddLineComponent";

    setup(){
        this.pos = usePos();
        this.line = useState({product_id : "",qty : 1, unit : null})
    }

    async onchangeProduct(ev){

        let uom_s = this.pos.models['uom.uom'].getAll();
        
        
    }

    async remove_measurement_line(){
        
    }

    get unites(){
            return this.pos.models['uom.uom'].getAll();
        
    }

    
}