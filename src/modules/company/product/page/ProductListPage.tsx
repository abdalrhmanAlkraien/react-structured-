import {ProductListComponent} from "../component/ProductListComponent.tsx";
import {AddButton} from "../../../../common/component/common/AddButton.tsx";

export function ProductListPage(){
    return (
        <>
            <div className="page-header">
                <h1>Product</h1>

                <div style={{display: "flex", gap: 8}}>
                    <AddButton
                        label="Add Product"
                        to="/company/products/create"
                    />
                </div>
            </div>
            <ProductListComponent/>
        </>
    )
}