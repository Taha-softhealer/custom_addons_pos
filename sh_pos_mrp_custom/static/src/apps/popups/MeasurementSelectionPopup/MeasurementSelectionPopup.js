/** @odoo-module */
import { Component, useState } from "@odoo/owl";
import { _t } from "@web/core/l10n/translation";
import { Dialog } from "@web/core/dialog/dialog";

export class MeasurementSelectionPopup extends Component {
    static template = "sh_pos_mrp_custom.MeasurementSelectionPopup";
    static components = { Dialog };
    static props = {
        title: { type: String, optional: true },
        list: { type: Array, optional: true },
        getPayload: Function,
        close: Function,
    };
    static defaultProps = {
        title: _t("Select"),
        list: [],
    };
    shCreate (){
        this.state.createMeasurement = true;
        this.confirm();
    }
    
    setup() {
        this.state = useState({ selectedId: this.props.list.find((item) => item.isSelected) });
    }
    selectItem(itemId) {
        this.state.selectedId = itemId;
        this.confirm();
    }
    computePayload() {
        if (this.state.createMeasurement){
            return "create_new_record"
        }else{
            const selected = this.props.list.find((item) => this.state.selectedId === item.id);
            return selected && selected.item;
        }
    }
    cancel(){
        this.props.close();
    }
    confirm() {
        this.props.getPayload(this.computePayload());
        this.props.close();
    }
}
