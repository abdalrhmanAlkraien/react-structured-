import {useEffect, useState} from "react";
import {useAuth} from "../../../../context/auth/useAuth.ts";
import {useNavigate, useParams} from "react-router-dom";
import {useNotification} from "../../../../context/notification/UseNotification.tsx";
import {getCategoryById, updateCategory} from "../service/CategoryService.ts";
import {Spinner} from "../../../../common/component/spinner/Spinner.tsx";
import {DynamicUpdateForm} from "../../../../common/component/update/DynamicUpdateForm.tsx";
import {CategoryForm} from "../type/CategoryForm.ts";

export function CategoryUpdateComponent() {
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
                const res = await getCategoryById(user.companyId, id);

                setInitialValues({
                    __meta__: { companyId: user.companyId },
                    externalId: res.externalId,
                    name: res.name,

                    parentCategoryExternalId: res.parentCategoryExternalId, // "ccut-1000"
                    parentCategoryName: res.parentCategoryName,             // "Electronics"
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
            await updateCategory(user.companyId, id!, payload);
            await notify.success("Updated successfully");
            navigate("/company/categories");
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
                sections={CategoryForm}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                loading={saving}
            />
        </div>
    );
}
