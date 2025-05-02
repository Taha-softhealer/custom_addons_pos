
import { PosStore } from "@point_of_sale/app/store/pos_store";
import { patch } from "@web/core/utils/patch";

patch(PosStore.prototype, {

    get image_src(){
        return '/web/image/pos.config/'+this.config.id+'/receipt_logo'
    },

    getReceiptHeaderData(order){
        console.log("==========>",this.image_src);
        
        const result=super.getReceiptHeaderData(order)
        result["receipt_image"]= this.config.enable_pos_receipt_logo ? this.image_src : false
        return result        
    }
})