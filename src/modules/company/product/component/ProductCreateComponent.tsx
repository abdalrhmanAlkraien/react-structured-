import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../../context/auth/useAuth.ts";
import {useNotification} from "../../../../context/notification/UseNotification.tsx";
import {Spinner} from "../../../../common/component/spinner/Spinner.tsx";
import {DynamicCreateForm} from "../../../../common/component/create/DynamicCreateForm.tsx";
import {ProductForm} from "../type/ProductForm.ts";
import {createProduct} from "../service/ProductService.ts";

export function ProductCreateComponent() {

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

            await createProduct(user?.companyId, formData);
            await notify.success("Create successfully");
            navigate("/company/products");
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
            <h1 className="title-create-form">Create New Product</h1>

            <DynamicCreateForm
                sections={ProductForm}
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