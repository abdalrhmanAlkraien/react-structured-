import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {registerCompany} from "../service/companyService.ts";
import styles from "../style/CreateCompanyComponent.module.css"
import {DynamicCreateForm} from "../../../../common/component/create/DynamicCreateForm.tsx";
import {createCompanyForm} from "../type/CreateCompanyForm.ts";

export function CreateCompanyComponent() {

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(formData: any) {
        try {
            setLoading(true);
            console.log("FORM DATA:", formData);

            await registerCompany(formData);
            alert("Company created successfully!");

            navigate("/platform/company");
        } catch (err) {
            console.error(err);
            alert("Failed to create company");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create New Company</h1>

            <DynamicCreateForm
                sections={createCompanyForm}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
}