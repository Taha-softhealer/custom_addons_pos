/** @odoo-module */

import { AbstractAwaitablePopup } from "@point_of_sale/app/popup/abstract_awaitable_popup";
import { _t } from "@web/core/l10n/translation";
import { useState } from "@odoo/owl";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { BomComponents } from "@sh_pos_mrp_custom/apps/popups/sh_update_bom_popup/components/bom_components/bom_components";
import { ShMeasurementLineData } from "@sh_pos_mrp_custom/apps/popups/MesurementPopup/components/sh_measurement_line";


export class ShModificationPopup extends AbstractAwaitablePopup {
    static template = "sh_pos_mrp_custom.ShModificationPopup";
    static components = { BomComponents, ShMeasurementLineData };

    setup(){
        this.pos = usePos();
        this.measurement = this.props.measurement
        this.pos_order_line_bom_lines = []
        this.measurement_line = []
        this.component_modification = []
        this.mo_measurement_modification = []
        this.sh_measurement_note = ""
        this.component_note = ""
        this.changes = useState({
            name: this.measurement.name || false, 
            sh_measurement_note: this.measurement.sh_measurement_note || false, 
            category_name: this.props.category_name
        })
        this.get_measurement_lines = this.measurement.sh_measurement_line_ids || []
        this.get_measurement_types = []
        this.create_new_measurement = {}
    }
    async onChangeCategory(ev){
        var self = this;
        self.get_measurement_types = []
        let selected_option = $(ev.target.list).find("[value='"+ev.target.value+"']")
        let categ_id = selected_option.attr('data-category_id')
        self.selected_category_id = parseInt(categ_id)
        if (this.measurement && this.measurement.category_id != parseInt(categ_id)){
            let measurement_category = await this.pos.sh_measurement_category_by_id[categ_id];
            if (measurement_category){
                for(let type_id of measurement_category.sh_measurement_line_ids){
                    self.get_measurement_types.push(await self.pos.sh_measurement_type_by_id[type_id])
                }
            }
        } 

        self.render(true)
    }
    confirm(){
        var self = this;
        for (let bom_line_details of $('.sh-bom-line')) {
            let product_name = $(bom_line_details).find('.sh_bom_line_selection').val();
            let datalist = $(bom_line_details).find('.sh_bom_line_selection').attr('list') //ev.target.list
            let selected_option = $('#'+datalist).find("[value='"+product_name+"']")
            let product_id = selected_option.attr('data-product_id')
            
            var sh_final_product_id = $(bom_line_details).find('.sh_default_componenet_selection').val();
            var sh_product_id = product_id
            var sh_product_qty = $(bom_line_details).find('.sh_bom_quantity').val()
            var sh_product_uom = $(bom_line_details).find('.sh_bom_unit_selection').val()
            var linedic = {
                sh_product_id: parseInt(sh_product_id),
                sh_product_qty: parseFloat(sh_product_qty),
                sh_product_uom: parseInt(sh_product_uom),
            }
            this.pos_order_line_bom_lines.push([0,0, linedic])

            var production_component_modify = {
                modified_product_id: parseInt(sh_product_id),
                final_product_id: parseInt(sh_final_product_id),
                product_qty: parseInt(sh_product_qty),
                product_uom_id: parseInt(sh_product_uom),
                pos_order_id: self.props.pos_order_id,
                production_id: self.props.mo_id
            }

            if ( $(bom_line_details).hasClass('sh_update') ){
                production_component_modify['update_state'] = "modified"
            } else if ( $(bom_line_details).hasClass('sh_new_line') ){
                production_component_modify['update_state'] = "new"
            }
            this.component_modification.push(production_component_modify)
        }
        
        let category_name = $('.sh_modification_categ_id').val()
        this.component_note = $('#sh_component_note').val()
        let datalist_id = $('.sh_modification_categ_id').attr('list')
        let selected_option = $('#'+datalist_id).find("[value='"+category_name+"']")
        let categ_id = selected_option.attr('data-category_id')

        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        // This arrangement can be altered based on how we want the date's format to appear.
        let currentDate = `${day}-${month}-${year}`;

        this.create_new_measurement = {
            name: this.props.customer_masurement ? this.props.customer_masurement.name : '' + ' =' + currentDate ,
            category_id: categ_id,
            sh_partner_id: this.props.customer_masurement ? this.props.customer_masurement.sh_partner_id[0] ? this.props.customer_masurement.sh_partner_id[0] : this.props.customer_masurement.sh_partner_id : '',
            sh_measurement_note: $('#sh_measurement_note').val()
        }

        for (let meas_line_details of $('.sh-measurement-line-data')) {
            var sh_measurement_type_id = parseInt($(meas_line_details).find('.sh_measurement_type_selection').attr('measurement_id'))
            var sh_uom_id = $(meas_line_details).find('.sh_measurement_type_unit_selection').val()


            var pos_line_mes_update = {
                sh_measurement_type_id: parseInt(sh_measurement_type_id),
                sh_uom_id: parseInt(sh_uom_id),
            }

            var mo_mesurement = {
                sh_measurement_type_id: parseInt(sh_measurement_type_id),
                sh_uom_id: parseInt(sh_uom_id),
                production_id: self.props.mo_id
            }

            for (let input of $(meas_line_details).find('.sh_measurement_size')){
                pos_line_mes_update[ $(input).attr('id') ] = $(input).val()
                mo_mesurement[ $(input).attr('id') ] = $(input).val()
            }

            if ( $(meas_line_details).hasClass('sh_measurement_updated')){
                mo_mesurement['update_state'] = "modified"
            } else if ( $(meas_line_details).hasClass('sh_measurement_new_line') ){
                mo_mesurement['update_state'] = "new"
            }
            
            this.measurement_line.push([0,0, pos_line_mes_update])
            this.mo_measurement_modification.push(mo_mesurement)
        }
        

        this.sh_measurement_note = $('#sh_measurement_note').val()
        super.confirm()
    }

    getPayload() {
        var dic =  {
            'pos_line_update': {
                sh_component_ids: this.pos_order_line_bom_lines,
                sh_measurement_line_ids: this.measurement_line
            },
            'component_note': this.component_note,
            'create_new_measurement': this.create_new_measurement,
            'component_modification': this.component_modification,
            'measurement_modification': this.mo_measurement_modification,
            'sh_measurement_note': this.sh_measurement_note
        }
        return dic
    }

}