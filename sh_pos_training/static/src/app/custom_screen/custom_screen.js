/** @odoo-module */

import { _t } from "@web/core/l10n/translation";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { Dialog } from "@web/core/dialog/dialog";
import { registry } from "@web/core/registry";
import { Component, useState } from "@odoo/owl";

export class custom_screen extends Component {

    static template = "sh_pos_training.custom_screen"

    setup(){
        this.pos = usePos()
        this.state = useState({
            showInput : false,
            name : "",
            editInput : "",
            editId : 0,
        })
    }
    back(){
        this.pos.showScreen("ProductScreen")
    }
    get all_notes(){
        return this.pos.models["pre.define.note"].getAll()
    }
    edit_note(note){

        this.state.editId=note.id
        this.state.editInput=note.name
        
    }
    save_note(event){
        console.log("===========>",this.state.editId);
        let note_obj = this.pos.models["pre.define.note"].get(this.state.editId)
        
        this.pos.models["pre.define.note"].update(note_obj ,{"name" : this.state.editInput})
        this.pos.data.write("pre.define.note" ,[this.state.editId] ,{"name" : this.state.editInput})
        this.state.editId=0
        this.state.editInput=""
    }
    create_note(){
        this.state.showInput = true
    }
    create_single_note(){
        let note_name = this.state.name
        this.pos.models["pre.define.note"].create({"name" : note_name})
        console.log("89098t", this.state , this.state.name);
        this.pos.data.create("pre.define.note" ,[{"name" : note_name}])
        this.pos.showScreen("custom_screen")
    }
    delete_note(event){
        let note_id = event.currentTarget.dataset.id
        let note_obj = this.pos.models["pre.define.note"].get(note_id)
        
        this.pos.models["pre.define.note"].delete(note_obj)
        this.pos.data.call("pre.define.note" ,"unlink" , [[note_id]])
    }
}

registry.category("pos_screens").add("custom_screen", custom_screen);