import { _t } from "@web/core/l10n/translation";
import { ControlButtons } from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { makeAwaitable } from "@point_of_sale/app/store/make_awaitable_dialog";
import { SelectionOrderTypePopup } from "@sh_pos_order_type/apps/popups/sh_order_type_popup/order_type_popup";
import { PartnerList } from "@point_of_sale/app/screens/partner_list/partner_list";


patch(ControlButtons.prototype, {
  setup() {
    super.setup(...arguments)
    this.dialog = useService("dialog");
  },
  async onClickOrderTypeBtn() {
    const order = this.pos.get_order()
    
    const all_order_types = this.pos.models['sh.order.type'].getAll().map((type) => {
      if ( type.id == order.sh_order_type_id.id ){
        return {
          id: type.id,
          item: type,
          label: type.name,
          isSelected: true,
        }
      }else{
        return {
          id: type.id,
          item: type,
          label: type.name,
          isSelected: false,
        }
      }
    })

    const order_type = await makeAwaitable(this.dialog, SelectionOrderTypePopup, {
      title: _t("Select Order Type!"),
      list: all_order_types,
    });

    if (order_type.is_home_delivery && !order.get_partner()){
      
      const partner = await makeAwaitable(this.dialog, PartnerList);
      if (partner){
        order.set_partner(partner)
        this.pos.get_order().set_order_type(order_type)
      }
    }else{
      this.pos.get_order().set_order_type(order_type)
    }


  }
})