/** @odoo-module */

import { Component, useState, useRef, onMounted } from "@odoo/owl";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { useService } from "@web/core/utils/hooks";
import { renderToElement } from "@web/core/utils/render";
import { BomAddLineComponent } from "@sh_pos_mrp_custom/apps/popups/sh_update_bom_popup/components/bom_add_line/bom_add_line";
import { onWillStart } from "@odoo/owl";


export class BomComponents extends Component {
    static components = { BomAddLineComponent };
    static template = "sh_pos_mrp_custom.BomComponents";


    setup() {
        this.pos = usePos();
        this.changes = this.props.changes
        this.state_lines = useState({ cat_units: this.get_all_units() ,components : this.props.bom_components, sh_component_ids : [], quantity :{}, sh_product_uom : {},sh_product_name : {}, sh_product_id : {}})
        this.init = 1
        onMounted(this.onMounted);
        this.onWillStart();
        
    }

    async onWillStart(){
        this.props.changes.quantity = Object.assign({}, this.props.changes.quantity, this.state_lines.quantity);
        this.props.changes.sh_product_id = Object.assign({},this.props.changes.sh_product_id, this.state_lines.sh_product_id)
        this.props.changes.sh_product_name = Object.assign({},this.props.changes.sh_product_name, this.state_lines.sh_product_name)
        this.props.changes.sh_product_uom = Object.assign({},this.props.changes.sh_product_uom,this.state_lines.sh_product_uom)
        
    }
    get products() {
        return this.pos.models['product.product'].filter((x) => x.sh_is_fabric)
    }
    get_unites(product) {
        
        return this.pos.models['uom.uom'].filter((x) => x.category_id.id == product.uom_id.category_id.id)
    }
    get_all_units(){
        return this.pos.models['uom.uom'].getAll();
    }
    async onMounted() {
        var self = this;
        const bom_components = this.props.bom_components

    }
    remove_measurement_line(event,com_id) {
        debugger
        this.state_lines.components = this.state_lines.components.filter(obj => obj.id !== com_id);
        console.log("-----com------>",com_id);
        
        this.props.changes.sh_component_ids.pop(com_id)
        
    }
    onchangeProduct(event, com_id) {

        const selectedValue = event.target.value;
        const dataListId = event.target.getAttribute('list'); // Get the datalist ID
        const dataList = document.getElementById(dataListId);

        if (dataList) {
            const selectedOption = Array.from(dataList.options).find(
                (option) => option.value === selectedValue
            );

            if (selectedOption) {
                // Retrieve the data-product_id attribute
                const productId = selectedOption.getAttribute('data-product_id');
                this.changes.sh_product_id[parseInt(com_id)] = parseInt(productId)

            }
        }

    }

    add_onchangeProduct(event, com_id) {
        console.log(this.state_lines);
        const selectedValue = event.target.value;
        const dataListId = event.target.getAttribute('list'); // Get the datalist ID
        const dataList = document.getElementById(dataListId);

        if (dataList) {
            const selectedOption = Array.from(dataList.options).find(
                (option) => option.value === selectedValue
            );
            if (selectedOption) {
                // Retrieve the data-product_id attribute
                const productId = selectedOption.getAttribute('data-product_id');
                this.changes.sh_product_id[parseInt(com_id)] = parseInt(productId)
                let product = this.products.filter((x)=>x.id == productId)
                this.state_lines.cat_units = this.get_unites(product[0])
                this.state_lines.sh_product_id[com_id] = productId;
                this.state_lines.sh_product_uom[com_id] = product[0].uom_id.id
                this.onWillStart(); 

        }
    }
    

    }

    changeQuantity(){
        this.onWillStart();
    }

    onchangeUOM(event, com_id) {
        const selectedValue = event.target.value;
        const dataListId = event.target.getAttribute('list'); // Get the datalist ID
        const dataList = document.getElementById(dataListId);

        if (dataList) {
            const selectedOption = Array.from(dataList.options).find(
                (option) => option.value === selectedValue
            );

            if (selectedOption) {
                const productId = selectedOption.getAttribute('data-product_id');
            }
        }

        this.onWillStart();

    }
    async add_new_line(ev, isfabric = null) {
        
        let cid = this.init;
        this.state_lines.sh_component_ids.push(cid)
        this.props.changes.sh_component_ids = this.props.changes.sh_component_ids.concat(this.state_lines.sh_component_ids)

        this.state_lines.components.push({
            'sh_product_id': 0, quantity: 0, id: cid, 'product_uom_id': 0, component: "", product_uom_id: 0, 'product_uom_category_id': 0,
        })

        this.init += 1
    }
}