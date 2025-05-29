/** @odoo-module */

import { Component, useState, useRef, onMounted } from "@odoo/owl";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { useService } from "@web/core/utils/hooks";

export class ShMeasurementLineData extends Component {
    static template = "sh_pos_mrp_custom.ShMeasurementLineData";

    setup() {
        this.pos = usePos();
        this.orm = useService("orm");

        this.changes =  useState({
            sh_measurement_type_id: this.props.line.sh_measurement_type_id ? this.props.line.sh_measurement_type_id[1] : this.props.line.name,
            unit_id: this.props.line.sh_uom_id ? this.props.line.sh_uom_id[0] : false, 
        })
    }
    get line_id(){
        return this.props.line.sh_measurement_type_id ? this.props.line.id : false
    }
    ShChnageSize(ev){
        var row = ev.target.closest('tr'); // Find the closest <tr> element
        if (row && !row.classList.contains('sh_measurement_new_line')) {
            row.classList.add('sh_measurement_updated');
        }
        
    }
    sh_size_array(type_id){
        var self = this;
        let size_length = type_id.sh_enter_size_length
        let all_size = []
        
        if (type_id.sh_enter_size_length){
            for (let i=1; i < (size_length + 1); i++){
                all_size.push('')
            }
        }else{
            for (let i=1; i < 10; i++){
                if (type_id['size_'+i]){
                    all_size.push(type_id['size_'+i])
                }
            }
        }

        return all_size
    }
    get get_unites(){
        let type = this.props.line
        let uom_selection = type.type_uom_ids ? type.type_uom_ids: this.pos.sh_measurement_type_by_id[type.sh_measurement_type_id[0]].type_uom_ids
        if (uom_selection){
            let unites = this.pos.units.filter((x) => uom_selection.includes(x.id))
            return unites
        }else{
            return []
        }
    }
    remove_measurement_line(element) {
        var self = this;
        var removed_line_id = element.attr('sh_line_id')
        if (removed_line_id && this.props.modification_popup === undefined) {
            try {
                // return decodeURIComponent( escape( this ) );
                this.orm.call("sh.measurement.line", "sh_unlink_line", [parseInt(removed_line_id)]).then(function (measurement_id) {
                    if (measurement_id) {
                        self.pos.update_measurement_by_id(parseInt(measurement_id))
                    }
                })
            } catch (e) {
                return this; // invalid UTF-8? return as-is
            }
        }
        element.remove()
    }

}
