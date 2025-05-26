import { PosStore } from "@point_of_sale/app/store/pos_store";
import { patch } from "@web/core/utils/patch";
import { ConfirmationDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { ask } from "@point_of_sale/app/store/make_awaitable_dialog";

patch(PosStore.prototype, {
    async editLots(product, packLotLinesToEdit) {
        let result = await super.editLots(product, packLotLinesToEdit);
        if (
            this.config.sh_lot_expiry_warning ||
            (this.config.sh_restrict_lot_expiry &&
                (product.alert_time || product.use_expiration_date))
        ) {
            let existingLots = [];
            try {
                existingLots = await this.data.call(
                    "pos.order.line",
                    "sh_get_existing_lots",
                    [this.company.id, product.id],
                    {
                        context: {
                            config_id: this.config.id,
                        },
                    }
                );
            } catch (ex) {
                alert("Can't load lots");
                console.log("Collecting sh existing records fail", ex);
            }
            let Currentdate = new Date();
            let daysToAdd = product.use_expiration_date
                ? product.alert_time
                : 0;
            let lotName = result?.newPackLotLines[0]?.lot_name;
            let addedDate = new Date();
            let selectedLot = existingLots?.filter(
                (lot) => lot.name == lotName
            );
            let expiry_value = false;

            if (!lotName) {
                return result;
            }
            if (selectedLot.length > 0 && selectedLot[0].expiration_date) {
                expiry_value = selectedLot[0].expiration_date;
            }
            let expiry_date = expiry_value
                ? new Date(selectedLot[0].expiration_date)
                : "";
            let timeDifference = expiry_date - Currentdate;
            let daysDifference = timeDifference / (1000 * 3600 * 24);

            addedDate.setDate(addedDate.getDate() + daysToAdd);
            if (
                Math.round(daysDifference) <= -1 &&
                expiry_value &&
                this.config.sh_restrict_lot_expiry
            ) {
                this.dialog.add(ConfirmationDialog, {
                    title: "Expiry Warning",
                    body:
                        "You can't sell it, Because Lot/Serial Number " +
                        lotName +
                        " of " +
                        product.name +
                        " has been expired on " +
                        expiry_date?.toLocaleDateString()
                });
                return;
            } else if (
                -1 < daysDifference &&
                Math.round(daysDifference) <= daysToAdd &&
                expiry_value &&
                this.config.sh_lot_expiry_warning
            ) {
                const _confirmed = await ask(this.dialog, {
                    title: "Alert Warniing",
                    body:
                        "The Lot/Serial Number " +
                        lotName +
                        " of " +
                        product.name +
                        " will expire on " +
                        expiry_date?.toLocaleDateString(),
                    confirmLabel: "Okay",
                });
                if (!_confirmed) {
                    return;
                }
            }
        }
        return result;
    },
});
