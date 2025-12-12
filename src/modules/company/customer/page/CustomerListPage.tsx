import {AddButton} from "../../../../common/component/common/AddButton.tsx";
import {CustomerListComponent} from "../component/CustomerListComponent.tsx";
import {ImportPopup} from "../../../../common/component/upload/ImportPopup.tsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {importCustomers, uploadCustomerFile, validateCustomerImport} from "../service/CustomerService.ts";
import {useAuth} from "../../../../context/auth/useAuth.ts";

export function CustomerListPage() {

    const navigate = useNavigate();
    const [openImport, setOpenImport] = useState(false);
    const {user} = useAuth();

    return (
        <div>

            <div className="page-header">
                <h1>Customer</h1>

                <div style={{ display: "flex", gap: 8 }}>
                    <AddButton
                        label="Add Customer"
                        to="/company/customers"
                    />

                    <div style={{ display: "flex", gap: 8 }}>
                        <button
                            className="btn btn-outline btn-md"
                            onClick={() => setOpenImport(true)}
                        >
                            Import Companies
                        </button>
                    </div>
                </div>
            </div>

            <CustomerListComponent />

            <ImportPopup
                open={openImport}
                title="Import Customers"
                bucket="CUSTOMER"
                onClose={() => setOpenImport(false)}

                uploadService={(file, bucket) =>
                    uploadCustomerFile(file, bucket)
                }
                onValidate={(fileUrl) => {
                    if (!user?.companyId) {
                        return Promise.reject("Company ID missing");
                    }
                    return validateCustomerImport(user.companyId, fileUrl);
                }}

                onImport={({ fileUrl, fileType }) => {
                    if (!user?.companyId) {
                        return Promise.reject("Company ID missing");
                    }
                    return importCustomers(user.companyId, {
                        fileUrl,
                        fileType,
                    });
                }}

                onViewHistory={() =>
                    navigate("/company/customers/import-history")
                }
            />
        </div>
    )
}