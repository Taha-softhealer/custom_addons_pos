import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { patch } from "@web/core/utils/patch";
import { ask } from "@point_of_sale/app/store/make_awaitable_dialog";
import { custom_popup } from "@sh_quick_receipt/overrides/screens/custom_popup/custom_popup"

patch(ProductScreen.prototype, {
    async test_button() {
        if (this.pos.get_order().get_orderlines().length == 0) {
            const response = await ask(this.dialog, {
                title: "Nothing to print",
                body: "There are no order lines",
            });
            return;
        }
        // console.log(this.pos.showScreen("ReceiptScreen"));
        this.dialog.add(custom_popup, {

        })
        // console.log(this.pos.getRenderedReceipt(this.pos.get_order()));
        
        // let rec= await this.validateOrder()
    },
});
