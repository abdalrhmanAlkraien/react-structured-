import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../../context/auth/useAuth.ts";
import {useNotification} from "../../../../context/notification/UseNotification.tsx";
import {DynamicCreateForm} from "../../../../common/component/create/DynamicCreateForm.tsx";
import {createCategory} from "../service/CategoryService.ts";
import {CategoryForm} from "../type/CategoryForm.ts";
import {Spinner} from "../../../../common/component/spinner/Spinner.tsx";

export function CategoryCreateComponent() {

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {user} = useAuth();
    const notify = useNotification();

    async function handleSubmit(formData: any) {
        try {
            setLoading(true);
            if (!user?.companyId) {
                alert("User company ID is missing");
                return;
            }

            await createCategory(user?.companyId, formData);
            await notify.success("Create successfully");
            navigate("/company/categories");
        } catch (err: any) {
            console.error(err);
            await notify.error(
                err?.response?.data?.message || "Create failed"
            );
        } finally {
            setLoading(false);
        }
    }

    if (!user?.companyId) {
        return <Spinner/>; // or spinner
    }

    return (
        <div className="container-create-form">
            <h1 className="title-create-form">Create New Customer</h1>

            <DynamicCreateForm
                sections={CategoryForm}
                onSubmit={handleSubmit}
                initialData={{
                    __meta__: {
                        companyId: user?.companyId, // 🔥 THIS IS REQUIRED
                    },
                }}
                loading={loading}
            />
        </div>
    );
}
