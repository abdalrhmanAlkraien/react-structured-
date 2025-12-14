import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../../../../context/auth/useAuth.ts";
import {useNotification} from "../../../../context/notification/UseNotification.tsx";
import {Spinner} from "../../../../common/component/spinner/Spinner.tsx";
import {DynamicUpdateForm} from "../../../../common/component/update/DynamicUpdateForm.tsx";
import {ProductForm} from "../type/ProductForm.ts";
import {getProductsById, updateProduct} from "../service/ProductService.ts";

export function ProductUpdateComponent() {

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
                const res = await getProductsById(user.companyId, id);

                setInitialValues({
                    __meta__: { companyId: user.companyId },
                    externalId: res.externalId,
                    name: res.name,
                    price: res.price,
                    stock: res.stock,
                    description: res.description,

                    categoryId: res.categoryId, // "ccut-1000"
                    categoryName: res.categoryName,             // "Electronics"
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
            await updateProduct(user.companyId, id!, payload);
            await notify.success("Updated successfully");
            navigate("/company/products");
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
            <h1>Update Category</h1>

            <DynamicUpdateForm
                sections={ProductForm}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                loading={saving}
            />
        </div>
    );
}