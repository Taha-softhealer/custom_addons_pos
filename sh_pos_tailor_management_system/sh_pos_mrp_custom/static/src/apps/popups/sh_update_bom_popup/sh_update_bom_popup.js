/** @odoo-module */
import { Component, useState } from "@odoo/owl";
import { _t } from "@web/core/l10n/translation";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { useService } from "@web/core/utils/hooks";
import { onMounted } from "@odoo/owl";
import { Dialog } from "@web/core/dialog/dialog";

import { BomComponents } from "@sh_pos_mrp_custom/apps/popups/sh_update_bom_popup/components/bom_components/bom_components";

export class shUpdateBomPopup extends Component {
    static template = "sh_pos_mrp_custom.shUpdateBomPopup";
    static components = { Dialog, BomComponents };
    setup() {
        super.setup();
        this.pos = usePos();
        this.orm = useService("orm");
        console.log("Update has been called here...",this.props.components);
        

        this.changes = useState({
            sh_component_ids : this.props.components.map((x) => x.id),
            sh_product_id: (Object.fromEntries(this.props.components.map((combo) => [combo.id, combo.product_id.id]))),
            quantity: (Object.fromEntries(this.props.components.map((combo) => [combo.id, combo.product_qty]))),
            sh_product_name: Object.fromEntries(this.props.components.map((combo) => [combo.id, combo.product_id.display_name.replaceAll(' ', '_')])),
            sh_product_uom: (Object.fromEntries(this.props.components.map((combo) => [combo.id, combo.product_id.uom_id.id]))),
        })
        console.log("This is Changed is Here ...");
        console.log(this.changes);
        
    }
    set_state_date() {
    }
    async confirm() {
        this.sh_component_note = this.props.sh_component_note;

        this.props.getPayload({ payload: this.changes, sh_component_note: this.sh_component_note });
        this.props.close();
    }

}
