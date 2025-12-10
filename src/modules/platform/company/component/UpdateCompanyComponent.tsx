import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DynamicUpdateForm } from "../../../../common/component/update/DynamicUpdateForm";
import { updateCompanyForm } from "../type/UpdateCompanyForm";
import { api } from "../../../../config/axios.config";


export function UpdateCompanyComponent() {
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get(`/companies/${id}`);
        // Expect backend returns:
        // { company: {...}, user: {...} } OR { ...flat }
        // If flat, you map it to the structure you want
        setInitialValues({
          company: {
            name: res.data.companyName,
            companyAddress: res.data.companyAddress,
            companyPhone: res.data.companyPhone,
            email: res.data.companyEmail,
            companyDomain: res.data.companyDomain,
            plan: res.data.plan,
          },
        });
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  async function handleSubmit(payload: any) {
    setSaving(true);
    try {
      await api.put(`/companies/${id}`, payload);
      // show success, navigate, etc…
    } finally {
      setSaving(false);
    }
  }

  if (loading || !initialValues) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Update Company</h1>
      <DynamicUpdateForm
        sections={updateCompanyForm} // ✅ reuse same structure
        initialValues={initialValues}
        onSubmit={handleSubmit}
        loading={saving}
        submitLabel="Update Company"
      />
    </div>
  );
}
