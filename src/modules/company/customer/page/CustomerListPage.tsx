import {AddButton} from "../../../../common/component/common/AddButton.tsx";
import {CustomerListComponent} from "../component/CustomerListComponent.tsx";

export function CustomerListPage() {
    return (
        <div>
            <div className="page-header">
                <h1>Customers</h1>
                <AddButton label="Add New Customer" to="/company/customers/create" />
            </div>

            <CustomerListComponent />
        </div>
    )
}