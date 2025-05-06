/** @odoo-module **/

import { registry } from "@web/core/registry";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { useService } from "@web/core/utils/hooks";
import { Component, useState } from "@odoo/owl";
import { ConfirmationDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { makeAwaitable, makeActionAwaitable, ask } from "@point_of_sale/app/store/make_awaitable_dialog";
import { AlertDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { _t } from "@web/core/l10n/translation";


export class OrderListScreen extends Component {
    static template = "sh_pos_order_list.OrderListScreen";
    setup() {
        this.pos = usePos();
        this.ui = useState(useService("ui"));
        this.action = useService("action");
        this.dialog = useService("dialog");
        this.orm = useService("orm");
        this.search_filter = false
        this.currentPage = 1;
        this.limit = 0
        this.totalCount = this.get_all_orders().length;
        this.nPerPage = this.pos.config.sh_how_many_order_per_page;
        this.offset = this.nPerPage + (this.currentPage - 1) * this.nPerPage;
        this.state = useState({
            search_word: ""
        })
    }
    get_all_orders() {
        return this.pos.models['pos.order'].filter((order) => typeof order.id === "number")
    }
    get currentOrder() {
        if (this.pos.get_order()) {
            return this.pos.get_order()
        } else {
            return false
        }
    }
    async print_pos_order(order) {
        event.stopPropagation()
        if (order) {
            this.pos.printReceipt({ order: order, sh_reprint: true });
        }
    }
    async reorder_pos_order(order) {
        var self = this;
        event.stopPropagation()
        if (order) {
            var order_lines = self.pos.get_order().get_orderlines();
            [...order_lines].map(async (line) => await self.currentOrder.removeOrderline(line));
            if (order.partner_id) {
                await self.currentOrder.set_partner(order.partner_id)
            }
            if (order.lines) {
                for (let line of order.lines) {
                    var product = line.product_id
                    if (product) {
                        await this.pos.addLineToCurrentOrder({
                            product_id: product,
                            qty: line.qty,
                            customerNote: line.customer_note || null,
                        }, {}, false);
                        if (line.discount) {
                            self.currentOrder.get_selected_orderline().set_discount(line.discount)
                        }
                    }
                }
                self.back()
            }
        }
    }
    sh_appy_search(search) {
        return this.get_all_orders().filter(function (template) {
            if (template.name.indexOf(search) > -1) {
                return true;
            } else if (template["pos_reference"].indexOf(search) > -1) {
                return true;
            } else if (template.partner_id && (template.partner_id.name.indexOf(search) > -1 || template.partner_id.name.toLowerCase().indexOf(search) > -1)) {
                return true;
            } else if (template["state"] && template["state"].indexOf(search) > -1) {
                return true;
            } else if (template["date_order"] && template["date_order"].indexOf(search) > -1) {
                return true;
            } else {
                return false;
            }
        })
    }
    get get_orders() {
        if (this.search_filter) {
            return this.filteredOrders.slice(this.limit, this.offset);
        } else {
            var orders = this.get_all_orders().slice(this.limit, this.offset)
            return orders.sort((a, b) => (b.id - a.id));
        }
    }
    async updateOrderList(event) {
        var search = event.target.value;
        if (search) {
            var Orders = await this.sh_appy_search(search)
            this.search_filter = true
            this.filteredOrders = Orders
        } else {
            this.search_filter = false
            this.filteredOrders = []
        }
        this.render(true)
    }
    async change_date(event) {
        let search = event.target.value;
        if (search) {
            var Orders = await this.sh_appy_search(search)
            this.search_filter = true
            this.filteredOrders = Orders
            this.render(true)
        } else {
            this.search_filter = false
            this.filteredOrders = []
        }
    }
    async ShApplyFilter(ev) {
        let search = ev.target.value;
        if (search == "all") {
            this.search_filter = false
            this.filteredOrders = []
        } else {
            this.search_filter = true
            var Orders = await this.sh_appy_search(search)
            this.filteredOrders = Orders
        }
        this.render(true)
    }
    onNextPage() {
        if (this.currentPage <= this.lastPage) {
            this.currentPage += 1;
            this.limit = this.offset;
            this.offset = this.nPerPage + (this.currentPage - 1) * this.nPerPage;
            this.render()
        }
    }
    onPrevPage() {
        if (this.currentPage - 1 > 0) {
            this.currentPage -= 1;
            this.limit = this.nPerPage + (this.currentPage - 1 - 1) * this.nPerPage;
            this.offset = this.limit + this.nPerPage;
            this.render()
        }
    }
    get lastPage() {
        let nItems = 0
        if (this.search_filter) {
            nItems = this.filteredOrders.length;
            return Math.ceil(nItems / (this.nPerPage));
        } else {
            nItems = this.totalCount;
            return Math.ceil(nItems / (this.nPerPage));
        }
    }
    get pageNumber() {
        const currentPage = this.currentPage;
        const lastPage = this.lastPage;
        return isNaN(lastPage) ? "" : `(${currentPage}/${lastPage})`;
    }
    clear_search() {
        this.state.search_word = ""
        this.search_filter = false
        this.filteredOrders = []
        this.render(true)
    }
    clickLine(orderlist) {
        if (this.show_lines == orderlist.id) {
            this.show_lines = 0
        } else {
            this.show_lines = orderlist.id
        }
        this.render(true)
    }
    back() {
        this.pos.showScreen('ProductScreen')
    }
    async sh_modify_mo() {
        let order = this.pos.models['pos.order'].filter((order) => order.id === this.show_lines)
        let sh_mo_ids = order[0].sh_mo_ids.filter(mo => mo.state !== 'done').map(mo => mo.id);
        if (sh_mo_ids && sh_mo_ids[0]) {
            const record = await makeActionAwaitable(this.action,
                "sh_pos_mrp_custom.mrp_production_action_edit_pos",
                {
                    props: { resId: sh_mo_ids[0] },
                }
            );
            const updated_record = await this.pos.data.read("mrp.production", record.config.resIds);

        } else {
            this.dialog.add(AlertDialog, {
                title: _t("Invalid"),
                body: _t("No MO founded."),
            });
        }
    }
    async sh_modify_measuremnt(line) {
        var self = this;
        if (line.sh_production_id){
            console.log("line==>", line, (typeof (line.sh_production_id)));
            let sh_mo_ids
            if (typeof (line.sh_production_id) == 'number') {
                sh_mo_ids = await this.pos.data.call("mrp.production", 'read', [line.sh_production_id]);
            } else {
                sh_mo_ids = await this.pos.data.call("mrp.production", 'read', [line.sh_production_id.id]);
            }
            // let order = this.pos.models['pos.order'].filter((order) => order.id === this.show_lines)
            console.log('sh_mo_ids', sh_mo_ids);
    
            if (sh_mo_ids && sh_mo_ids[0]) {
                const mo_obj = sh_mo_ids[0]
    
                if (mo_obj.sh_measurement_modification_request_line.length == 0) {
                    for (let i = 0; i < mo_obj?.sh_mrp_production_measurement_line.length; i++) {
                        const mes_id = mo_obj?.sh_mrp_production_measurement_line[i];
                        const mes = await this.pos.data.call("sh.mrp.production.measurement", 'read', [mes_id]);
                        var rec = mes[0]
                        var new_mes_dic = {
                            size_1: rec.size_1,
                            size_2: rec.size_2,
                            size_3: rec.size_3,
                            size_4: rec.size_4,
                            size_5: rec.size_5,
                            size_6: rec.size_6,
                            size_7: rec.size_7,
                            size_8: rec.size_8,
                            size_9: rec.size_9,
                            size_10: rec.size_10,
                            sh_uom_id: rec?.sh_uom_id ? rec?.sh_uom_id[0] : false,
                            production_id: mo_obj.id,
                            sh_measurement_type_id: rec.sh_measurement_type_id[0]
                        }
                        var cre_rec = await self.pos.data.create("sh.measurement.modification.request", [new_mes_dic]);
                        console.log('cre_rec ===> ', cre_rec);
    
                    }
                }
    
                console.log(sh_mo_ids.id);
    
                const record = await makeActionAwaitable(this.action,
                    "sh_pos_mrp_custom.mrp_production_measurement_action_edit_pos",
                    {
                        props: { resId: sh_mo_ids[0].id },
                        additionalContext: { 'test': 123 },
                    }
                );
                console.log('re-----',record, sh_mo_ids[0].state == "fitting_not_ok");
                if (sh_mo_ids[0].state == "fitting_not_ok"){
                    await this.pos.data.call("mrp.production", 'write', [record.config.resId, {
                        'state': 'modification'
                    }]);
                }else{
                    await this.pos.data.call("mrp.production", 'write', [record.config.resIds, {
                        'state': 'modification'
                    }]);
                }

                // const updated_record = await this.pos.data.read("mrp.production", record.config.resIds);
                // await this.pos.data.write("mrp.production", [updated_record.id], { state: 'modification' });
            } else {
                this.dialog.add(AlertDialog, {
                    title: _t("Invalid"),
                    body: _t("No MO founded."),
                });
            }
        }

    }
    async pick_up_order(order) {

        await ask(this.dialog, {
            title: _t("Delivery"),
            body: 'Are you sure you want to done delivery ? ',
        });

        var Allmodone = await this.pos.data.call("pos.order", 'sh_picking_done', [order.id]);

        if (Allmodone.all_mo_done == "done") {
            await this.dialog.add(ConfirmationDialog, { title: "Delivery !", body: " Quantity Deliverd... " });
        } else if (Allmodone.all_mo_done == "mo_not_confirm") {
            await this.dialog.add(ConfirmationDialog, { title: "Delivery !", body: " Production order is not done ! " });
        } else if (Allmodone.all_mo_done == 'pocking_done') {
            await this.dialog.add(ConfirmationDialog, { title: "Delivery !", body: " Quantity Already Deliverd..." });
        } else if (Allmodone.all_mo_done == 'pocking_not_created') {
            await this.dialog.add(ConfirmationDialog, { title: "Delivery !", body: " Delivery order not found..." });
        }
    }
    async get_fitting_feedback(ev, line) {
        ev.stopPropagation()
        var self = this;
        console.log('line --> ', line);

        const line_datas = await this.pos.data.call("pos.order.line", "sh_search_line_data", [], { domain: [["id", "=", parseInt(line.id)]], fields: ['sh_production_line'] })
        // .then(async function (line_datas) {
        console.log('line_datas ---> ', line_datas);

        if (line_datas && line_datas.length) {
            let current_mos = line_datas.filter(line => line?.state !== "cancel")
            if (current_mos?.length) {
                const { id, name } = current_mos[0];
                const sh_confirm = await ask(self.dialog, {
                    title: _t("Fitting feedback"),
                    body: _t(name + ' Fitting Ok ? '),
                });
                console.log('sh_confirm----',sh_confirm);
                
                if (sh_confirm){
                    console.log('mo id-->',id);
                    this.pos.data.call("mrp.production", "sh_fitting_ok", [[id]])
                }else{
                    this.pos.data.call("mrp.production", "sh_fitting_not_ok", [[id]])   
                }
            }
        }
        // })
    }
}
registry.category("pos_screens").add("OrderListScreen", OrderListScreen);
