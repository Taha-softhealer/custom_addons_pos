/** @odoo-module **/

import { _t } from "@web/core/l10n/translation";
import { useService } from "@web/core/utils/hooks";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { SelectionPopup } from "@point_of_sale/app/utils/input_popups/selection_popup";
import { ControlButtons } from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";
import { patch } from "@web/core/utils/patch";

patch(ControlButtons.prototype, {
       setup() {
        super.setup(...arguments)
        this.dialog = useService("dialog");
        this.pos = usePos();
    },
    async ShDependencyButton() {
        var order = this.pos.get_order();
        if ( !order.orderlines.length ){
            return false
        }
        let selected_order_line = order.get_selected_orderline()
        var selectionList = []
        for (let line of order.orderlines) {
            if( line.uuid != selected_order_line.uuid && line.sh_parent_order_line_uuid == "" ){
                var dict = {
                    id: line.id,
                    label: line.full_product_name,
                    isSelected: false,
                    item: line,
                }
                selectionList.push(dict)
            }
        }

        const { confirmed, payload: SelectedOrderline } = await this.pos.popup.add(SelectionPopup, {
            title: _t("Select the Branch"),
            list: selectionList,
        });

        if ( confirmed ){
            selected_order_line.set_parenet_line_id(SelectedOrderline.uuid)
        }

    }
})


