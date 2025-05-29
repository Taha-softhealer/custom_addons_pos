/** @odoo-module */

import { _t } from "@web/core/l10n/translation";
import { useState } from "@odoo/owl";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { Component, useState } from "@odoo/owl";


export class ShOrderRefundPopup extends Component {
    static template = "sh_pos_mrp_custom.ShOrderRefundPopup";
    static defaultProps = {
        cancelText: _t("Cancel"),
        title: _t("Select"),
        body: "",
        list: [],
        confirmKey: false,
    };
    setup() {
        super.setup();
        this.pos = usePos();
        let empl_id =   false
        this.state = useState({ selectedId: 0,employee_name: empl_id ? empl_id.name.replaceAll(' ','_') : false });
        this.reason = useState({text : ''})
    }
    selectItem(itemId) {
        this.state.selectedId = itemId;
        this.render(true)
    } 
    confirm(){
        if( !this.state.employee_name ) {
            alert('please select Employee !')
            return 
        } else{
            super.confirm()
        }
    }

    getPayload() {
        const selected = this.props.list.find((item) => this.state.selectedId === item.id);
        const reason = []
        for(let line of $(".each_refund_reason")){
            if( $($(line).find('.sh_refund_reason_name')).attr("item_id")){
                let reason_data = {
                    'sh_order_reason_id' : $($(line).find('.sh_refund_reason_name')).attr("item_id"),
                    'sh_order_reason_note' : $($(line).find('.sh_refund_reason')).val(),
                }
                reason.push(reason_data)
            }
        }
        var employee_name  = this.state.employee_name
        let selected_option = $('#shEmployeeOptions').find("[value='"+employee_name+"']")
        let empl_id = selected_option.attr('data-employee_id')

        return selected, {reason, empl_id}
    }
}
