/** @odoo-module */

import { PartnerDetailsEdit } from "@point_of_sale/app/screens/partner_list/partner_editor/partner_editor";
import { patch } from "@web/core/utils/patch";
import { onMounted } from "@odoo/owl";

patch(PartnerDetailsEdit.prototype, {
    setup(){
        super.setup()
        const partner = this.props.partner;
        this.changes['parent_id'] = partner.parent_id || false
        onMounted(this.onMounted);
    },
    onMounted() {
        $('#parent').select2()
    },
    saveChanges() {
        let parent_id = $('#parent').val()
        this.changes['parent_id'] = parent_id || false
         
        super.saveChanges()
    }
});
