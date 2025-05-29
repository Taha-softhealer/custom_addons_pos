import { DataServiceOptions } from "@point_of_sale/app/models/data_service_options";
import { patch } from "@web/core/utils/patch";

patch(DataServiceOptions.prototype, {
    get databaseTable() {
        return {
            ...super.databaseTable,
            "sh.pos.order.line.component": {
                key: "id",
                condition: (record) => {
                    // return true
                    record.models["pos.order.line"].find((l) => {
                        const customAttrIds = l?.sh_component_ids.map((v) => v.id);
                        return customAttrIds.includes(record.id);
                    })
                },
            },
            "sh.measurement": {
                key: "id",
                condition: (record) => {
                    // return true
                    record.models["pos.order.line"].find((l) => {
                        // const customAttrIds = l?.sh_component_ids.map((v) => v.id);
                        return l.sh_measurement_id == record.id;
                    })
                },
            },
            "sh.pos.order.line.measurement": {
                key: "id",
                condition: (record) => {
                    // return true
                    record.models["pos.order.line"].find((l) => {
                        const customAttrIds = l?.sh_measurement_line_ids.map((v) => v.id);
                        return customAttrIds.includes(record.id);
                    })
                },
            },
        };
    },
    get dynamicModels() {
        return [...super.dynamicModels, "sh.pos.order.line.component", "sh.measurement", "sh.pos.order.line.measurement"];
    },
    get cascadeDeleteModels() {
        return [...super.cascadeDeleteModels, "sh.pos.order.line.component", "sh.measurement", "sh.pos.order.line.measurement"];
    }
});
