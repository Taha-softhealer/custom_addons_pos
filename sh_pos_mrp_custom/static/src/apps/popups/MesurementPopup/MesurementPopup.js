// /** @odoo-module */
import { Component, useState } from "@odoo/owl";
import { _t } from "@web/core/l10n/translation";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { useService } from "@web/core/utils/hooks";
import { onMounted } from "@odoo/owl";
import { Dialog } from "@web/core/dialog/dialog";

export class MeasurementPopup extends Component {
    static template = "sh_pos_mrp_custom.MeasurementPopup";
    static components = { Dialog };
    setup() {
        super.setup();
        var self = this;
        this.pos = usePos();
        this.orm = useService("orm");
        // this.selectedMeasurement = this.props.selectedMeasurement || false
        this.measurement_id = false
        // this.sh_measurement_types = this.props.sh_measurement_types
        
    }
}
        
        // let empl_id = this.selectedMeasurement.employee_id ? this.pos.sh_get_empl_by_id[this.selectedMeasurement.employee_id ] : false
//         const date = new Date();

//         let day = date.getDate();
//         let month = date.getMonth() + 1;
//         let year = date.getFullYear();

//         // This arrangement can be altered based on how we want the date's format to appear.
//         let currentDate = `${day}-${month}-${year}`;

//         this.changes = useState({
//             name: this.selectedMeasurement.name || currentDate, 
//             sh_measurement_note: this.selectedMeasurement.sh_measurement_note || false, 
//             category_name: this.selectedMeasurement.category_id ? self.pos.sh_measurement_category_by_id[this.selectedMeasurement.category_id].name.replaceAll(' ','_') : false,
//             employee_name: empl_id ? empl_id.name.replaceAll(' ','_') : false,
//         })
//         this.selected_category_id = this.selectedMeasurement.category_id || false
//         this.get_measurement_types = []
//         this.get_measurement_lines = this.selectedMeasurement.sh_measurement_line_ids || []
//     }
//     async getPayload(){
//         var measurement_id =  this.measurement_id
//         return {selected_measurement_id : measurement_id}
//     }
//     get imageUrl() {
//         const category_id = this.selected_category_id || false
//         if (category_id){
//             return `/web/image?model=sh.measurement.category&field=image_128&id=${category_id}`;
//         }else{
//             return `/web/static/img/placeholder.png`;
//         }
//     }
//     async CreateNew(){
//         this.selectedMeasurement = false
//         $('.o_input').val('')
//         $('.sh_measurement_line_table').empty()
//         this.render(true)

//     }
//     async onChangeCategory(ev){
//         var self = this;
//         self.get_measurement_types = []
//         let selected_option = $(ev.target.list).find("[value='"+ev.target.value+"']")
//         let categ_id = selected_option.attr('data-category_id')
//         self.selected_category_id = parseInt(categ_id)
    
//         let measurement_category = await this.pos.sh_measurement_category_by_id[categ_id];
//         if (measurement_category && this.selectedMeasurement.category_id != parseInt(categ_id)){
//             for(let type_id of measurement_category.sh_measurement_line_ids){
//                 self.get_measurement_types.push(await self.pos.sh_measurement_type_by_id[type_id])
//             }
//         }

//         self.render(true)
//     }
//     async shEdit(){
//         var self = this;
//         var name = this.changes.name
//         var sh_measurement_note = this.changes.sh_measurement_note
//         var employee_name  = this.changes.employee_name
//         if( !employee_name ) {
//             alert('please select Employee !')
//             return 
//         }
//         let selected_option = $('#shEmployeeOptions').find("[value='"+employee_name+"']")
//         let empl_id = selected_option.attr('data-employee_id')

//         var sh_measurement_line_ids = []
//         if (name){
//             for ( let line of $('.sh-measurement-line-details') ){
//                 if ($(line).find('.sh_measurement_type_selection').val()){
//                     var dict = {
//                         'id': parseInt($(line).attr('sh_line_id')),
//                         'sh_measurement_type_id': parseInt($(line).find('.sh_measurement_type_selection').attr('measurement_id')),
//                         'sh_uom_id': parseInt($(line).find('.sh_measurement_type_unit_selection').val()),
//                         'category_id': this.selected_category_id,
//                     }
//                     for (let size_data of $(line).find('.sh_measurement_size')){
//                         dict[$(size_data).attr('id')] = $(size_data).val()
//                     }
//                     sh_measurement_line_ids.push(dict)
//                 }else{
//                     alert('Please enter type')
//                     return 
//                 }
//             }
//             await this.orm.call("sh.measurement", "write", [this.selectedMeasurement.id, 
//                 {'name': name, 'sh_measurement_note': sh_measurement_note, 'category_id':this.selected_category_id, 'employee_id': parseInt(empl_id)}
//             ])
            
//             let mes_lines = []
//             if ( sh_measurement_line_ids && sh_measurement_line_ids.length ) {
//                 for (let line of sh_measurement_line_ids){
//                     var new_line = line
//                     new_line['sh_measurement_id'] = this.selectedMeasurement.id
//                     mes_lines.push(new_line)
                    
//                 }
//             }
//             // Remove old lines
//             var mes_line_ids = this.selectedMeasurement.sh_measurement_line_ids.map((x) => x.id)
//             await self.orm.call("sh.measurement.line", "sh_unlink_line", [mes_line_ids])
            
//             // Create new lines
//             await this.orm.call("sh.measurement.line", "create", [ 
//                 mes_lines
//             ])
//             if (this.selectedMeasurement){
//                 await self.pos.update_measurement_by_id(this.selectedMeasurement.id)
//                 self.measurement_id = this.selectedMeasurement.id
//                 this.confirm()
//             }
//         }else{
//             alert('Please Enter Name')
//         }
        
//     }
//     async sh_create(){
//         var self = this;
//         var name = this.changes.name
//         var sh_measurement_note = this.changes.sh_measurement_note
//         var sh_measurement_line_ids = []
//         if (name){
//             var employee_name  = this.changes.employee_name
//             if( !employee_name ) {
//                 alert('please select Employee !')
//                 return 
//             }
//             let selected_option = $('#shEmployeeOptions').find("[value='"+employee_name+"']")
//             let empl_id = selected_option.attr('data-employee_id')
            
//             for ( let line of $('.sh-measurement-line-details') ){
//                 if ($(line).find('.sh_measurement_type_selection').val()){
//                     var dict = {
//                         'sh_measurement_type_id': parseInt($(line).find('.sh_measurement_type_selection').attr('measurement_id')),
//                         'sh_uom_id': parseInt($(line).find('.sh_measurement_type_unit_selection').val()),
//                     }
//                     for (let size_data of $(line).find('.sh_measurement_size')){
//                         dict[$(size_data).attr('id')] = $(size_data).val()
//                     }
//                     sh_measurement_line_ids.push(dict)
//                 }else{
//                     alert('Please enter type')
//                     return 
//                 }
//             }
            
//             var Vals = {
//                 'name': name,
//                 'sh_partner_id': this.pos.get_order().get_partner().id,
//                 'sh_measurement_note': sh_measurement_note,
//                 'category_id':this.selected_category_id,
//                 'employee_id': empl_id,
//                 'sh_measurement_line_ids': []
//             }
//             for (let line of sh_measurement_line_ids){
//                 Vals['sh_measurement_line_ids'].push([0, 0, line])
//             }

//             await this.orm.call("sh.measurement", "create", [
//                 Vals
//             ]).then(function (measurement) {
//                 self.measurement_id = measurement
//             });
//             await self.pos.update_measurement_by_id(self.measurement_id)
            
//             this.confirm()
//         }else{
//             alert('Please Enter Name')
//         }
        
//     }
// }