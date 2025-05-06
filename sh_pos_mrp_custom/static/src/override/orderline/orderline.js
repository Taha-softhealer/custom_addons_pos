/** @odoo-module */

import { Orderline } from "@point_of_sale/app/generic_components/orderline/orderline";
import { patch } from "@web/core/utils/patch";
import { SelectionPopup } from "@point_of_sale/app/utils/input_popups/selection_popup";
import { _t } from "@web/core/l10n/translation";
import { makeAwaitable } from "@point_of_sale/app/store/make_awaitable_dialog";
import { PosOrderline } from "@point_of_sale/app/models/pos_order_line";

patch(PosOrderline.prototype, {
    shFittingToggle(ev) {
        var line = this.props.line.sh_line_obj;
        line.set_fitting(ev.target.checked)
    },
    shonHoldToggle(ev) {
        let order = this.order_id;
        console.log('-======>', this.props);

        var line = this.props.line.sh_line_obj;
        let value = ev.target.checked
        let selected_order_line = line

        var selectionList = []
        for (let line of order.orderlines) {
            if (line.uuid != selected_order_line.uuid && line.sh_parent_order_line_uuid == "") {
                var dict = {
                    id: line.id,
                    label: line.full_product_name,
                    isSelected: false,
                    item: line,
                }
                selectionList.push(dict)
            }
        }
        const payload = makeAwaitable(this.dialog, SelectionPopup, {
            title: _t("Select the Branch"),
            list: selectionList,
        });


        if (payload) {
            selected_order_line.set_parenet_line_id(payload.uuid)
            selected_order_line.set_onhold(value)
        } else {
            selected_order_line.set_parenet_line_id('')
            selected_order_line.set_onhold(false)
        }

    }
});
patch(Orderline.prototype, {
    shFittingToggle(ev, line) {
        console.log("ev.target.checked", ev.target.checked, line);

        ev.stopPropagation()
        var line_obj = posmodel.models['pos.order.line'].get(line?.line_id)
        if (line_obj) {

            line_obj.sh_is_fitting = ev.target.checked
        }
    },

});
// patch(Orderline.prototype, {

// });


patch(Orderline, {
    props: {
        ...Orderline.props,
        line: {
            ...Orderline.props.line,
            shape: {
                ...Orderline.props.line.shape,
                sh_is_fitting: { type: Boolean, optional: true },
                sh_is_onhold: { type: Boolean, optional: true },
                sh_order_finalized: { type: Boolean, optional: true },
                measurement_name: { type: String, optional: true },
                fitting_in_cart: { type: Boolean, optional: true },
                sh_parent_product: { type: String, optional: true },
                line_id: { type: [Number, String], optional: true },
            },
        },
    },
});
