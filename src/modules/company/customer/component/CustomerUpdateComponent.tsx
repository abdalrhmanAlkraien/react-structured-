import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getCustomerById, updateCustomer} from "../service/CustomerService.ts";
import {useAuth} from "../../../../context/auth/useAuth.ts";
import {DynamicUpdateForm} from "../../../../common/component/update/DynamicUpdateForm.tsx";
import {ProductForm} from "../type/ProductForm.ts";
import {Spinner} from "../../../../common/component/spinner/Spinner.tsx";
import {useNotification} from "../../../../context/notification/UseNotification.tsx";

export function CustomerUpdateComponent() {

    const {id} = useParams();
    const [initialValues, setInitialValues] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const {user} = useAuth();
    const navigate = useNavigate();
    const notify = useNotification();
    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const res = await getCustomerById(user?.companyId, id)
                // Expect backend returns:
                // { company: {...}, user: {...} } OR { ...flat }
                // If flat, you map it to the structure you want
                setInitialValues(
                    {
                        externalId: res.data.externalId,
                        name: res.data.name,
                        email: res.data.email,
                        phone: res.data.phone,
                        gender: res.data.gender,
                        age: res.data.age,
                    }
                );
            } finally {
                setLoading(false);
            }
        }

        if (id) load();
    }, [id]);

    async function handleSubmit(payload: any) {
        setSaving(true);

        if (!user?.companyId) {
            await notify.error("User company ID is missing");
            setSaving(false);
            return;
        }

        if (!id) {
            await notify.error("Customer ID is missing");
            setSaving(false);
            return;
        }

        try {
            await updateCustomer(user?.companyId, id, payload);
            await notify.success("Updated successfully");
            // show success, navigate, etc…
            navigate("/company/customers");
        } catch (err: any) {
            await notify.error(
                err?.response?.data?.message || "Update failed"
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading || !initialValues) {
        return <Spinner/>;
    }

    return (
        <div>
            <h1>Update Company</h1>
            <DynamicUpdateForm
                sections={ProductForm} // ✅ reuse same structure
                initialValues={initialValues}
                onSubmit={handleSubmit}
                loading={saving}
            />
        </div>
    );
}