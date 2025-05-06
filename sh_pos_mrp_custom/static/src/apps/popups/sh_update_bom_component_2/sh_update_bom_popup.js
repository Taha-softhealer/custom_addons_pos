/** @odoo-module */
import { Component, useState } from "@odoo/owl";
import { _t } from "@web/core/l10n/translation";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { useService } from "@web/core/utils/hooks";
import { onMounted } from "@odoo/owl";
import { Dialog } from "@web/core/dialog/dialog";
import { makeAwaitable, makeActionAwaitable } from "@point_of_sale/app/store/make_awaitable_dialog";

// import { BomComponents } from "@sh_pos_mrp_custom/apps/popups/sh_update_bom_popup/components/bom_components/bom_components";

export class shUpdateBomPopup2 extends Component {
    static template = "sh_pos_mrp_custom.shUpdateBomPopup2";
    static components = { Dialog };
    setup() {
        super.setup();
        this.pos = usePos();
        this.orm = useService("orm");
        this.init = 1
        this.action = useService("action");

        // this.changes = useState({
        //     sh_component_ids : this.props.components.map((x) => x.id),
        //     sh_product_id: (Object.fromEntries(this.props.components.map((combo) => [combo.id, combo.sh_product_id.id]))),
        //     quantity: (Object.fromEntries(this.props.components.map((combo) => [combo.id, combo.sh_product_qty]))),
        //     sh_product_name: Object.fromEntries(this.props.components.map((combo) => [combo.id, combo.sh_product_id.display_name.replaceAll(' ', '_')])),
        //     sh_product_uom: (Object.fromEntries(this.props.components.map((combo) => [combo.id, combo.sh_product_uom.id]))),
        // })
        this.state_lines = useState({ cat_units: this.get_all_units(), components: this.props.components, sh_component_ids: [], quantity: {}, sh_product_uom: {}, sh_product_name: {}, sh_product_id: {} })
        console.log('\nthis.state_lines.components ==========================================>\n')
        console.log(this.state_lines.components);


        this.state = useState({ set_units: this.get_all_units() })

        this.onWillStart();


    }
    async onWillStart() {
        this.state_lines.sh_component_ids = this.props.components.map((x) => x.id);
        this.state_lines.quantity = (Object.fromEntries(this.props.components.map((combo) => [combo.id, combo.sh_product_qty])));
        this.state_lines.sh_product_id = (Object.fromEntries(this.props.components.map((combo) => [combo.id, combo.sh_product_id.id])))
        this.state_lines.sh_product_name = Object.fromEntries(this.props.components.map((combo) => [combo.id, combo.sh_product_id.display_name.replaceAll(' ', '_')])),
            this.state_lines.sh_product_uom = (Object.fromEntries(this.props.components.map((combo) => [combo.id, combo.sh_product_uom.id])))

    }

    // Get all Products.
    get products() {
        return this.pos.models['product.product'].filter((x) => x.sh_is_fabric)
    }

    // Onchange Product 

    onchangeProduct(event, com_id) {

        const selectedValue = event.target.value;
        const dataListId = event.target.getAttribute('list'); // Get the datalist ID
        const dataList = document.getElementById(dataListId);

        if (dataList) {
            const selectedOption = Array.from(dataList.options).find(
                (option) => option.value === selectedValue
            );

            if (selectedOption) {
                // Retrieve the data-product_id attribute
                const productId = selectedOption.getAttribute('data-product_id');
                this.state_lines.sh_product_id[com_id] = (productId)
                console.log(productId);

            }
        }

    }


    add_onchangeProduct(event, com_id) {
        console.log(`event ===========> ${event}`)
        console.log(`com_id ===========> ${com_id}`)

        const selectedValue = event.target.value;
        console.log(`selectedValue ===========> ${selectedValue}`)
        const dataListId = event.target.getAttribute('list'); // Get the datalist ID
        console.log(`dataListId ===========> ${dataListId}`)
        const dataList = document.getElementById(dataListId);
        console.log(`dataList ===========> ${dataList}`)

        if (dataList) {
            const selectedOption = Array.from(dataList.options).find(
                (option) => option.value === selectedValue
            );
            if (selectedOption) {
                // Retrieve the data-product_id attribute
                const productId = selectedOption.getAttribute('data-product_id');
                // this.changes.sh_product_id[parseInt(com_id)] = parseInt(productId)
                let product = this.products.filter((x) => x.id == productId)
                this.state_lines.cat_units = this.get_unites(product[0])
                this.state_lines.sh_product_id[com_id] = productId;
                this.state_lines.sh_product_uom[com_id] = product[0].uom_id.id

                console.log("Hello");

                console.log(this.state_lines);

                // this.onWillStart();
            }
        }


    }

    // change quantity.
    changeQuantity() {
        // this.onWillStart();
    }

    async continue() {
        var order = this.pos.get_order()
        var measurment = this.props.selected_measurement
        console.log('measurment ----', measurment?.id);

        var partner = this.props.partner
        const record = await makeActionAwaitable(this.action,
            "sh_pos_mrp_custom.sh_measurement_action_edit_pos",
            {
                props: measurment !== "create_new_record" ? { resId: measurment?.id } : {},
                additionalContext: { sh_partner_id: partner?.id },
            }
        )
        this.confirm()
    }
    // get units base on category ids.
    get_unites(product) {
        console.log("Get Product paisa pais karit hai tu ...");

        return this.pos.models['uom.uom'].filter((x) => x.category_id.id == product.uom_id.category_id.id)
    }

    // Get all Units

    get_all_units() {
        return this.pos.models['uom.uom'].getAll();
    }

    // Remove Line 

    remove_measurement_line(event, com_id) {

        this.state_lines.sh_component_ids.shift(com_id)
        this.state_lines.components = this.props.components.filter(obj => obj.id !== com_id);
        // this.props.changes.sh_component_ids.shift(com_id)

    }

    // Remove Line :

    async add_new_line(ev, isfabric = null) {

        let cid = this.init;

        let component_dict = {
            "sh_product_id": 0,
            "sh_product_qty": 0,
            "sh_product_uom": 0,
            'sh_initial_qty': 0,
            "product_uom_category_id": 0,
            "sh_pos_order_line_id": this.pos.get_order().get_selected_orderline(),
        }
        var data = await this.pos.models['sh.pos.order.line.component'].create(component_dict)
        this.init += 1
    }

    set_state_date() {
    }
    async confirm() {
        this.sh_component_note = this.props.sh_component_note;

        this.props.getPayload({ payload: this.state_lines, sh_component_note: this.sh_component_note });
        this.props.close();
    }

}
