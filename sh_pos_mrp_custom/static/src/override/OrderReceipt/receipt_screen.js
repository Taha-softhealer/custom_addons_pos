/** @odoo-module */

import { ReceiptScreen } from "@point_of_sale/app/screens/receipt_screen/receipt_screen";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
patch(ReceiptScreen.prototype, {
  setup() {
    super.setup();
    this.orm = useService("orm");
    this.get_order_details();
  },

  async get_order_details() {
    let order = this.pos.get_order();
    let Orders = await this.orm.call("pos.order", "search_read", [
      [["pos_reference", "=", order.name]],
    ]);
      if (Orders) {
        if (Orders && Orders.length > 0) {
          order["pos_recept_name"] = Orders[0]["name"];
        }
        this.render();
      }
    
  },
});
