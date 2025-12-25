import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../../../../context/auth/useAuth.ts";
import {useNotification} from "../../../../context/notification/UseNotification.tsx";
import {Spinner} from "../../../../common/component/spinner/Spinner.tsx";
import {getOrderById, getOrders, updateOrders} from "../service/OrderService.ts";
import {DynamicUpdateForm} from "../../../../common/component/update/DynamicUpdateForm.tsx";
import {OrderForm} from "../service/OrderForm.ts";
import {toDateTimeLocal} from "../../../../common/lib/dateUtils.ts";

export function OrderUpdateComponent() {

    const {id} = useParams();
    const [initialValues, setInitialValues] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const {user} = useAuth();
    const navigate = useNavigate();
    const notify = useNotification();

    if (!user?.companyId) {
        return <Spinner/>;
    }


    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const res = await getOrderById(user.companyId, id);

                setInitialValues({
                    __meta__: { companyId: user.companyId },

                    externalId: res.externalId,
                    orderDate: toDateTimeLocal(res.orderDate),
                    totalAmount: res.totalAmount,
                    status: res.status,
                    transactionId: res.transactionId,

                    // api-select values
                    customerId: res.customer?.id,              // ✅ ADD
                    customerExternalId: res.customer?.externalId,
                    customerName: res.customer?.name,

                    items: res.items.map(item => ({
                        productId: item.product.id,
                        productExternalId: item.product.externalId,  // ✅ VALUE
                        productName: item.product.name,              // ✅ LABEL
                        quantity: item.quantity,
                        price: item.price
                    }))
                });
            } finally {
                setLoading(false);
            }
        }

        if (id) load();
    }, [id, user.companyId]);

    async function handleSubmit(payload: any) {
        setSaving(true);
        try {
            await updateOrders(user.companyId, id!, payload);
            await notify.success("Updated successfully");
            navigate("/company/orders");
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
            <h1>Update Order</h1>

            <DynamicUpdateForm
                sections={OrderForm}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                loading={saving}
            />
        </div>
    );
}