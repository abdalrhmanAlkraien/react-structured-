import {CompanyListComponent} from "../component/CompanyListComponent.tsx";
import {AddButton} from "../../../../common/component/common/AddButton.tsx";

export function CompanyPageList() {
    return (
        <div>
            <div className="page-header">
                <h1>Companies</h1>
                <AddButton label="Add New Company" to="/platform/company/create" />
            </div>

            <CompanyListComponent />
        </div>
    )
}
