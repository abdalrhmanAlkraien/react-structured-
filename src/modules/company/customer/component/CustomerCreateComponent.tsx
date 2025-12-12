import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {createCustomer} from "../service/CustomerService.ts";
import {useAuth} from "../../../../context/auth/useAuth.ts";
import {DynamicCreateForm} from "../../../../common/component/create/DynamicCreateForm.tsx";
import {ProductForm} from "../type/ProductForm.ts";
import {useNotification} from "../../../../context/notification/UseNotification.tsx";

export function CustomerCreateComponent() {

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {user} = useAuth();
    const notify = useNotification();

    async function handleSubmit(formData: any) {
        try {
            setLoading(true);
            console.log("FORM DATA:", formData);

            if (!user?.companyId) {
                alert("User company ID is missing");
                return;
            }

            await createCustomer(user?.companyId, formData);
            await notify.success("Create successfully");
            navigate("/company/customers");
        } catch (err: any) {
            console.error(err);
            await notify.error(
                err?.response?.data?.message || "Create failed"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container-create-form">
            <h1 className="title-create-form">Create New Customer</h1>

            <DynamicCreateForm
                sections={ProductForm}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
}
