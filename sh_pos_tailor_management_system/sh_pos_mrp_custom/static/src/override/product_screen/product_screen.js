/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { parseFloat as oParseFloat } from "@web/views/fields/parsers";

patch(ProductScreen.prototype, {
    _setValue(val) {
        super._setValue(...arguments)

        const { numpadMode } = this.pos;
        const selectedLine = this.currentOrder.get_selected_orderline();
        if (selectedLine && this.pos.config.sh_enable_bom) {
            if (numpadMode === "quantity") {
                if (val !== "remove") {
                    if (val) {
                        if (selectedLine.get_bom_details() && Object.values(selectedLine.get_bom_details()).length) {
                            let quant = typeof val === "number" ? val : oParseFloat("" + (val ? val : 0));
                            if (quant) {
                                if (selectedLine.core_componenet){
                                    var core_componenet = JSON.parse(selectedLine.core_componenet)
                                    for (let com_line of selectedLine.get_bom_details().bom_line_ids) {
                                        var filtered_component = core_componenet.filter((x) => parseInt(x.product_id) == parseInt(com_line.product_id))
                                        if (filtered_component && filtered_component.length) {
                                            com_line['product_qty'] = filtered_component[0].product_qty * quant
                                        } else {
                                            com_line['product_qty'] = 1
                                        }
                                    }
                                }else{
                                    for (let com_line of selectedLine.get_bom_details().bom_line_ids) {
                                        com_line['product_qty'] = quant * com_line['product_qty']
                                    }
                                }
                            } else {
                                if (selectedLine.core_componenet && selectedLine.core_componenet.length) {
                                    var core_componenet = JSON.parse(selectedLine.core_componenet)
                                    for (let com_line of selectedLine.get_bom_details().bom_line_ids) {
                                        var filtered_component = core_componenet.filter((x) => parseInt(x.product_id) == parseInt(com_line.product_id))
                                        if (filtered_component && filtered_component.length) {
                                            com_line['product_qty'] = filtered_component[0].product_qty
                                        } else {
                                            com_line['product_qty'] = 1
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        if (selectedLine.core_componenet && selectedLine.core_componenet.length) {
                            var core_componenet = JSON.parse(selectedLine.core_componenet)
                            for (let com_line of selectedLine.get_bom_details().bom_line_ids) {
                                var filtered_component = core_componenet.filter((x) => parseInt(x.product_id) == parseInt(com_line.product_id))
                                if (filtered_component && filtered_component.length) {
                                    com_line['product_qty'] = filtered_component[0].product_qty
                                } else {
                                    com_line['product_qty'] = 1
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});
