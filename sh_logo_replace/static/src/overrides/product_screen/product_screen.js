import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { patch } from "@web/core/utils/patch";

patch(ProductScreen.prototype,{

    getNumpadButtons(){
        let record=super.getNumpadButtons()
        if(this.pos.numpad){
            record.forEach(button => {
                button["disabled"]=true                
            });
        }
        if(this.pos.qty){
            record.forEach(button=>{
                if (button.value=="quantity") {
                    button["disabled"]=true
                }
            })
        }

        if(this.pos.price){
            record.forEach(button=>{
                if (button.value=="price") {
                    button["disabled"]=true
                }
            })
        }

        if(this.pos.remove){
            record.forEach(button=>{
                if (button.value=="Backspace") {
                    button["disabled"]=true
                }
            })
        }
        
        if(this.pos.plusminus){
            record.forEach(button=>{
                if (button.value=="-") {
                    button["disabled"]=true
                }
            })
        }
        
        return record
        
    }

    
})