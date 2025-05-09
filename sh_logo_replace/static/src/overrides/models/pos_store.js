
import { PosStore } from "@point_of_sale/app/store/pos_store";
import { patch } from "@web/core/utils/patch";

patch(PosStore.prototype, {

    get image_src(){
        return '/web/image/pos.config/'+this.config.id+'/receipt_logo'
    },
    
    get customer_selection(){
        return this.config.group_pos_disable_customer_selection
    },
    get payment_button(){
        return this.config.group_pos_disable_payment
    },
    get numpad(){
        return this.config.group_pos_disable_numpad
    },
    get qty(){
        return this.config.group_pos_disable_qty 
    },
    get price(){
        return this.config.group_pos_disable_price 
    },
    get remove(){
        return this.config.group_pos_disable_remove 
    },
    get plusminus(){
        return this.config.group_pos_disable_pm 
    },
    get newdel(){
        return this.config.group_pos_disable_newdel 
    },

    
    getReceiptHeaderData(order){
        
        const result=super.getReceiptHeaderData(order)
        result["receipt_image"]= this.config.enable_pos_receipt_logo ? this.image_src : false
        return result        
    },

})