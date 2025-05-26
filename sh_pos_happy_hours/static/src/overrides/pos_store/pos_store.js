import { PosStore } from "@point_of_sale/app/store/pos_store";
import { patch } from "@web/core/utils/patch";

patch(PosStore.prototype, {
    async UpdaterewardQty() {
        let order = this.get_order();
        let SelectedLine = order.get_selected_orderline();

        let freePackLine = order.lines?.filter((line) => {
            console.log("liiiine",line);
            console.log("selected liiiine",SelectedLine);
            
            return SelectedLine.product_id.id == line?.sh_free_pack_product_of_id?.id;
        });

        console.log("rewarded line", freePackLine);
    },

    async sh_check_quantity() {
        let happy_hours_id = this.config.sh_happy_hours_id;
        console.log("happy_hours_id", happy_hours_id);
        let order = this.get_order();
        let line = order.get_selected_orderline();
        let vals;

        if (
            happy_hours_id &&
            happy_hours_id.sh_set_pack_pricelist &&
            happy_hours_id.sh_packlist_ids.length > 0
        ) {
            console.log("true");
            console.log("inside if order", line);
            for (let j = 0; j < happy_hours_id.sh_packlist_ids.length; j++) {
                const pack = happy_hours_id.sh_packlist_ids[j];
                console.log("this is pack", pack);
                console.log(
                    "pack.sh_pack_product_id.id",
                    pack.sh_product_id.id
                );
                console.log("pack.sh_quantity", pack.sh_quantity);
                console.log("line product", line.product_id.id);
                console.log("line qty", line.qty);
                console.log(("ye vo he", line.qty / pack.sh_quantity) % 1);

                if (
                    pack.sh_product_id.id == line.product_id.id &&
                    (line.qty / pack.sh_quantity) % 1 == 0
                ) {
                    console.log("bhai bhai");
                    vals = { product_id: pack.sh_pack_product_id };
                    vals["price_unit"] = 0;
                    vals["sh_free_pack_product"] = true;
                    vals["sh_free_pack_product_of_id"] = line.product_id;
                    let opts;
                    let configure;
                    let newln = await super.addLineToOrder(
                        vals,
                        order,
                        (opts = {}),
                        (configure = true)
                    );
                    console.log("the product after vals", vals);

                    return newln;
                }
            }
        }
    },

    async addLineToOrder(vals, order, opts = {}, configure = true) {
        console.log("vals", vals);
        console.log("order", order);

        let result = await super.addLineToOrder(
            vals,
            order,
            (opts = {}),
            (configure = true)
        );

        await this.sh_check_quantity();
        return result;
    },
});

// let a = 10;
// let b = 5;
// let result = a / b;
// let isWholeNumber = result % 1 === 0;
// console.log(isWholeNumber); // true
