import { PosOrder } from "@point_of_sale/app/models/pos_order";
import { patch } from "@web/core/utils/patch";

patch(PosOrder.prototype, {
    set_pricelist(pricelist) {
        let rules
        let result=super.set_pricelist(pricelist)
        let same_product_tmpl=[]
        let quantity=0
        let lines = this.lines

        for (let index = 0; index < lines.length; index++) {
            const lineout = lines[index];
            same_product_tmpl = lines.filter((line) => {
                return (
                    line?.product_id.product_tmpl_id?.id ==
                    lineout?.product_id.product_tmpl_id?.id
                );
            });            
            quantity = same_product_tmpl.reduce(
                (sum, line) => sum + (line.qty || 0),
                0
            );

            rules = lineout.product_id.getPricelistRule(this.pricelist_id, quantity);    
            if (rules && rules.sh_enable_mixmatch_pricelist) {
                same_product_tmpl.forEach((line) => {
                    line.price_unit = line.product_id.get_price(
                        this.pricelist_id,
                        quantity
                    );
                });
            }            
        }
        return result
    },
});
