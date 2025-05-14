import { patch } from "@web/core/utils/patch";
import { PartnerList } from "@point_of_sale/app/screens/partner_list/partner_list";

patch(PartnerList.prototype, {
    getPartners() {
        let result = super.getPartners();
        let cashier_id = this.pos.cashier.id;
        let UpdatedPartner=[]

        for (let index = 0; index < result.length; index++) {
            const partner = result[index];
            for (let j = 0; j < partner.sh_user_ids.length; j++) {
                const element = partner.sh_user_ids[j];
                if (element.id == cashier_id) {
                    UpdatedPartner.push(partner)
                }
            }
        }
        return UpdatedPartner;
    },
});
