/** @odoo-module */

import { Component, useState, useRef, onMounted } from "@odoo/owl";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { useService } from "@web/core/utils/hooks";
import { renderToElement } from "@web/core/utils/render";

export class MeasurementLine extends Component {
    static template = "sh_pos_mrp_custom.MeasurementLine";

    setup() {
        this.pos = usePos();
        this.orm = useService("orm");
        onMounted(this.onMounted);
    }
    onMounted() {
        var self = this;
        var table_tbody = $('.sh_measurement_line_table')
        if (this.props.selectedMeasurement) {
            if (this.props.selectedMeasurement.sh_measurement_line_ids) {
                for (let line of this.props.selectedMeasurement.sh_measurement_line_ids) {
                    let table_len = table_tbody.find('tr').length
                    let type_id = self.pos.sh_measurement_type_by_id[line.sh_measurement_type_id[0]]
                    let all_unites = self.pos.units.filter((x) => type_id.type_uom_ids.includes(x.id))
                    let size_length = type_id.sh_enter_size_length
                    
                    let all_size = []
                    for (let i=1; i < (size_length + 1); i++){
                        all_size.push(line['size_'+i])
                    }
                    const LineData = renderToElement("sh_pos_mrp_custom.ShMeasurementLineData", {
                        props: { table_len: table_len },
                        all_unites: all_unites,
                        size_length: size_length,
                        onChnageType: function (ev) {
                            let val = ev.target.value
                            let type = self.pos.sh_measurement_type_by_id[parseInt(val)]
                            let all_unites = self.pos.units.filter((x) => type.type_uom_ids.includes(x.id))
                            var selection = '<select name="sh_measurement_type_unit_' + table_len + '"  class="sh_measurement_type_unit_selection sh_measurement_type_unit_selection_"' + table_len + '">'
                            if (all_unites) {
                                for (let coreunit of all_unites) {
                                    selection += '<option value="' + coreunit.id + '" unit_name="' + coreunit.display_name + '">' + coreunit.display_name + '</option>'

                                }
                            }
                            selection += "</selection>"
                            $('.sh_measurement_type_unit_selection_' + table_len).html(selection)
                        },
                        all_size: all_size,
                        changes: { selected_type: line.sh_measurement_type_id[0], uom_id: line.sh_uom_id ? line.sh_uom_id[0] : 0 },
                        line_id: line?.id || false,
                        sh_measurement_types: this.props.sh_measurement_types,
                        remove_measurement_line: function (ev) {
                            var find_ele = $(ev.target).closest('tr')
                            self.remove_measurement_line(find_ele)
                        },
                    }
                    );
                    table_tbody.append(LineData)
                }
            }
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
    add_new_line(ev) {
        // var self = this;
        // var table_tbody = $('.sh_measurement_line_table')
        // var table_len = table_tbody.find('tr').length
        // let all_unites = self.pos.units
        // const LineData = renderToElement(
        //     "sh_pos_mrp_custom.ShMeasurementLineData", {
        //     props: { table_len: table_len },
        //     all_size: [],
        //     size_length: 1,
        //     onChnageType: function (ev) {
        //         let val = ev.target.value
        //         let type = self.pos.sh_measurement_type_by_id[parseInt(val)]
        //         let all_unites = self.pos.units.filter((x) => type.type_uom_ids.includes(x.id))
        //         let size_length = type.sh_enter_size_length
                
        //         var td = " "
        //         for (let i=1; i < (size_length + 1); i++){
        //             td += "<input class='sh_measurement_size form-control sh_measurement_size_'"+i+" name=size_"+i+" id=size_"+i+" />"
        //         }
        //         td += " "
        //         // Dynamic input added
        //         $(ev.target.closest('tr')).find('.size').html(td)

        //         var selection = '<select name="sh_measurement_type_unit_' + table_len + '"  class="sh_measurement_type_unit_selection sh_measurement_type_unit_selection_"' + table_len + '">'
        //         if (all_unites) {
        //             for (let coreunit of all_unites) {
        //                 selection += '<option value="' + coreunit.id + '" unit_name="' + coreunit.display_name + '">' + coreunit.display_name + '</option>'

        //             }
        //         }
        //         selection += "</selection>"
        //         $('.sh_measurement_type_unit_selection_' + table_len).html(selection)
        //     },
        //     all_unites: all_unites,
        //     changes: { selected_type: 0, size: "", uom_id: 0 },
        //     sh_measurement_types: this.props.sh_measurement_types,
        //     remove_measurement_line: function (ev) {
        //         var find_ele = $(ev.target).closest('tr')
        //         self.remove_measurement_line(find_ele)
        //     },
        // }
        // );
        // table_tbody.append(LineData)

        
    }
}
