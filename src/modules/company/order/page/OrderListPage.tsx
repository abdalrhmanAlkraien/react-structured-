import {OrderListComponent} from "../component/OrderListComponent.tsx";
import {AddButton} from "../../../../common/component/common/AddButton.tsx";

export function OrderListPage(){

    return (
        <>
            <div className="page-header">
                <h1>Product</h1>

                <div style={{display: "flex", gap: 8}}>
                    <AddButton
                        label="Add Order"
                        to="/company/orders/create"
                    />
                </div>
            </div>
            <OrderListComponent/>
        </>
    )
}