import { OrderWidget } from "@point_of_sale/app/generic_components/order_widget/order_widget";
import { patch } from "@web/core/utils/patch";

patch(OrderWidget,{
    props:{
        ...OrderWidget.props,
        sh_enable_total_item: { type: Boolean, optional: true },
        sh_enable_total_qty: { type: Boolean, optional: true },
    }
})
