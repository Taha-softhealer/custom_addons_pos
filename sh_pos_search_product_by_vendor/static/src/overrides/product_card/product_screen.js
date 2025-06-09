import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { patch } from "@web/core/utils/patch";

patch(ProductScreen.prototype, {
    
    async shLoadProductFromDB() {
        if (this.pos.searchProductByVendor) {
            const allproduct = await this.pos.data.searchRead(
                "product.product",
                ["|", ["available_in_pos", "=", true], ["sale_ok", "=", true]],
                this.pos.data.fields["product.product"]
            );
            let products = [];
            const { searchProductByVendor } = this.pos;
            console.log("searched vendor", searchProductByVendor);
            let vendors = this.pos.models["product.supplierinfo"].getAll();
            let searched_vendors = vendors.filter((vendor) => {
                return vendor.display_name
                    .trim()
                    .toLowerCase()
                    .includes(searchProductByVendor.trim().toLowerCase());
            });

            console.log("all product", allproduct);

            for (let index = 0; index < searched_vendors.length; index++) {
                const vendor = searched_vendors[index];
                console.log("vennnndooor", vendor);

                let temp = allproduct.filter(
                    (product) =>
                        product.product_tmpl_id?.id == vendor.product_tmpl_id.id
                );
                console.log("temp", temp);

                // Avoid duplicates by checking for existing products
                temp.forEach((product) => {
                    // You can use a Set or a Map to ensure unique items
                    if (!products.find((p) => p.id === product.id)) {
                        console.log("pusssing the============");
                        products.push(product);
                    }
                });
            }
            await this.addMainProductsToDisplay(products);
        }
    },

    get productsToDisplay() {
        let result = super.productsToDisplay;
        console.log(result);
        if (this.pos.searchProductByVendor) {
            this.shLoadProductFromDB();
        }
        return result;
    },
});
