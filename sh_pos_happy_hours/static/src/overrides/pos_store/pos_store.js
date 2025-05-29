import { PosStore } from "@point_of_sale/app/store/pos_store";
import { patch } from "@web/core/utils/patch";

patch(PosStore.prototype, {
    sh_convert_num_to_time(number, period) {
        var sign = number >= 0 ? 1 : -1;
        number = number * sign;

        var hour = Math.floor(number);
        var decpart = number - hour;
        var min = 1 / 60;
        decpart = min * Math.round(decpart / min);

        var minute = Math.floor(decpart * 60);
        if (minute < 10) {
            minute = "0" + minute;
        }

        if (period === "am" && hour === 12) {
            hour = 0;
        } else if (period === "pm" && hour !== 12) {
            hour += 12;
        }
        var floatTime = hour + minute / 60;
        return sign * floatTime;
    },

    sh_sale_hours() {
        let happy_hours_id = this.config.sh_happy_hours_id;
        let date = new Date();
        if (happy_hours_id) {
            if (!happy_hours_id.sh_everyday) {
                let starting_date = new Date(
                    happy_hours_id.sh_starting_duration
                );
                let ending_date = new Date(happy_hours_id.sh_ending_duration);
                if (date >= starting_date && date <= ending_date) {
                    return true;
                }
                else{
                    return false;
                }
            } else {
                let currentTime = date.getHours() + (date.getMinutes() / 60);
                let starting_time = this.sh_convert_num_to_time(
                    happy_hours_id.sh_starting_time,
                    happy_hours_id.sh_starting_type
                );
                let ending_time = this.sh_convert_num_to_time(
                    happy_hours_id.sh_ending_time,
                    happy_hours_id.sh_ending_type
                );
                // console.log(currentTime);
                // console.log(starting_time);
                // console.log(ending_time);
                // console.log(
                //     currentTime >= starting_time && currentTime <= ending_time
                // );

                if (
                    currentTime >= starting_time &&
                    currentTime <= ending_time
                ) {
                    return true;
                }else{
                    return false;
                }
            }
        }
    },

    async sh_check_quantity() {
        let happy_hours_id = this.config.sh_happy_hours_id;
        let reward_lines;

        if (
            happy_hours_id &&
            happy_hours_id.sh_set_pack_pricelist &&
            happy_hours_id.sh_packlist_ids.length > 0
        ) {
            reward_lines = happy_hours_id.sh_packlist_ids;
            await this._sh_check_quantity(reward_lines, false);
        }

        if (
            happy_hours_id &&
            happy_hours_id.sh_buy_x_get_1_extra &&
            happy_hours_id.sh_one_free_product_ids.length > 0
        ) {
            reward_lines = happy_hours_id.sh_one_free_product_ids;
            await this._sh_check_quantity(reward_lines, true);
        }
    },

    async _sh_check_quantity(reward_lines, buyXget1) {
        let order = this.get_order();
        let SelectedLine = order.get_selected_orderline();
        let vals;
        let freePackLine = order.lines?.filter((line) => {
            console.log("liiiine", line);
            console.log("selected liiiine", SelectedLine.product_id);
            return (
                SelectedLine?.product_id?.id ==
                line?.sh_free_pack_product_of_id?.id
            );
        });
        for (let j = 0; j < reward_lines.length; j++) {
            const pack = reward_lines[j];
            if (
                pack.sh_product_id.id == SelectedLine?.product_id.id &&
                SelectedLine?.qty >= pack.sh_quantity
            ) {
                if (
                    freePackLine[0] &&
                    typeof freePackLine[0].qty === "number"
                ) {
                    freePackLine[0].qty = Math.floor(
                        SelectedLine?.qty / pack.sh_quantity
                    );
                } else {
                    vals = {
                        product_id: buyXget1
                            ? SelectedLine?.product_id
                            : pack.sh_pack_product_id,
                    };
                    vals["price_unit"] = 0;
                    vals["qty"] =
                        Math.floor(SelectedLine?.qty / pack.sh_quantity) || 1;
                    vals["sh_free_pack_product"] = true;
                    vals["sh_free_pack_product_of_id"] =
                        SelectedLine?.product_id;
                    let opts;
                    let configure;
                    let newln = await super.addLineToOrder(
                        vals,
                        order,
                        (opts = {}),
                        (configure = true)
                    );
                    console.log("the product after vals", vals);
                    return newln;
                }
            } else if (
                freePackLine[0] &&
                typeof freePackLine[0].qty === "number" &&
                SelectedLine?.qty < pack.sh_quantity
            ) {
                order.removeOrderline(freePackLine[0]);
            }
        }
    },

    async addLineToOrder(vals, order, opts = {}, configure = true) {
        let happy_hours_id = this.config.sh_happy_hours_id;
        let result = await super.addLineToOrder(
            vals,
            order,
            (opts = {}),
            (configure = true)
        );
        if (happy_hours_id) {

            if (happy_hours_id.sh_discount_on_product && happy_hours_id.sh_product_ids.length>0) {
                let products=happy_hours_id.sh_product_ids
                for (let index = 0; index < products.length; index++) {
                    const product = products[index];
                    if (product.id==vals.product_id.id) {
                        result.set_discount(happy_hours_id.sh_discount);
                    }
                }
                console.log("products from happy hours",happy_hours_id.sh_product_ids);
                console.log("added product",vals);
                
            }
            if (happy_hours_id.sh_set_pricelist && happy_hours_id.sh_offer_pricelist_id) {
                order.set_pricelist(happy_hours_id.sh_offer_pricelist_id);
            }
            if (this.sh_sale_hours()) {
                await this.sh_check_quantity();
            }
        }
        return result;
    },

    async sh_update_reward_qty() {
        let happy_hours_id = this.config.sh_happy_hours_id;
        let reward_lines;
        if (
            happy_hours_id &&
            happy_hours_id.sh_set_pack_pricelist &&
            happy_hours_id.sh_packlist_ids.length > 0
        ) {
            reward_lines = happy_hours_id.sh_packlist_ids;
            this._sh_update_reward_qty(reward_lines);
        }

        if (
            happy_hours_id &&
            happy_hours_id.sh_buy_x_get_1_extra &&
            happy_hours_id.sh_one_free_product_ids.length > 0
        ) {
            reward_lines = happy_hours_id.sh_one_free_product_ids;
            this._sh_update_reward_qty(reward_lines);
        }
    },

    _sh_update_reward_qty(reward_lines) {
        let order = this.get_order();
        let SelectedLine = order.get_selected_orderline();

        let freePackLine = order.lines?.filter((line) => {
            return (
                SelectedLine?.product_id?.id ==
                line?.sh_free_pack_product_of_id?.id
            );
        });

        for (let j = 0; j < reward_lines.length; j++) {
            const pack = reward_lines[j];
            if (
                pack.sh_product_id.id == SelectedLine?.product_id?.id &&
                SelectedLine?.qty >= pack.sh_quantity
            ) {
                if (
                    freePackLine[0] &&
                    typeof freePackLine[0].qty === "number"
                ) {
                    freePackLine[0].qty = Math.floor(
                        SelectedLine?.qty / pack.sh_quantity
                    );
                }
            } else if (
                freePackLine[0] &&
                typeof freePackLine[0].qty === "number" &&
                SelectedLine?.qty < pack.sh_quantity
            ) {
                order.removeOrderline(freePackLine[0]);
            }
        }
    },
});
