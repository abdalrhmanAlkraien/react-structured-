import React, { useEffect, useState } from "react";
import styles from "../create/style/DynamicCreateForm.module.css"; // reuse same styles
import type { FormSection } from "../../lib/FormSection";
import { api } from "../../../config/axios.config";


interface Props {
  sections: FormSection[];
  initialValues: Record<string, any> | null; // e.g. { company: {...}, user: {...} }
  onSubmit: (data: any) => void;
  loading?: boolean;
  submitLabel?: string;
}

export function DynamicUpdateForm({
  sections,
  initialValues,
  onSubmit,
  loading = false,
  submitLabel = "Save Changes",
}: Props) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [apiOptions, setApiOptions] = useState<Record<string, any[]>>({});
  const [openDropdown, setOpenDropdown] = useState<Record<string, boolean>>({});

  // ------------------------------
  // Load initial values (for UPDATE)
  // ------------------------------
  useEffect(() => {
    if (initialValues) {
      // Expecting same structure: { company: {...}, user: {...}, ... }
      setFormData(initialValues);
    }
  }, [initialValues]);

  // ------------------------------
  // Load API data for api-select & multi-select fields
  // ------------------------------
  useEffect(() => {
    sections.forEach((section) => {
      section.fields.forEach(async (field) => {
        if (
          (field.type === "api-select" || field.type === "multi-select") &&
          !field.dependsOn &&
          field.api
        ) {
          const res = await api.get(field.api);
          const list = Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data)
              ? res.data
              : [];

          setApiOptions((prev) => ({
            ...prev,
            [field.name]: list,
          }));
        } else if (field.type === "multi-select-dropdown" && field.api) {
          const res = await api.get(field.api);
          const list = Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data)
              ? res.data
              : [];

          setApiOptions((prev) => ({
            ...prev,
            [field.name]: list,
          }));
        }
      });
    });
  }, [sections]);

  // ------------------------------
  // Dependent api-select: e.g. city depends on country
  // ------------------------------
  useEffect(() => {
    sections.forEach((section) => {
      section.fields.forEach(async (field) => {
        if (field.type === "api-select" && field.dependsOn && field.api) {
          const parentSectionKey = section.objectKey;
          const parentValue =
            formData[parentSectionKey]?.[field.dependsOn];

          if (parentValue) {
            const url = field.api.replace("{countryId}", parentValue);
            const res = await api.get(url);

            const list = Array.isArray(res.data?.data)
              ? res.data.data
              : Array.isArray(res.data)
                ? res.data
                : [];

            setApiOptions((prev) => ({
              ...prev,
              [field.name]: list,
            }));
          }
        }
      });
    });
  }, [formData, sections]);

  // ------------------------------
  // Update field helper
  // ------------------------------
  function updateField(sectionKey: string, fieldName: string, value: any) {
    setFormData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] || {}),
        [fieldName]: value,
      },
    }));
  }

  // ------------------------------
  // Render a single field
  // ------------------------------
  function renderField(sectionKey: string, field: FormField) {
    const sectionValues = formData[sectionKey] || {};
    const value =
      sectionValues[field.name] ??
      (field.type === "multi-select" || field.type === "multi-select-dropdown"
        ? []
        : "");

    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "number":
      case "date":
        return (
          <input
            type={field.type === "textarea" ? "text" : field.type}
            className={styles.input}
            required={field.required}
            value={value}
            onChange={(e) =>
              updateField(sectionKey, field.name, e.target.value)
            }
          />
        );

      case "textarea":
        return (
          <textarea
            className={styles.textarea}
            required={field.required}
            value={value}
            onChange={(e) =>
              updateField(sectionKey, field.name, e.target.value)
            }
          />
        );

      case "select":
        return (
          <select
            className={styles.select}
            required={field.required}
            value={value}
            onChange={(e) =>
              updateField(sectionKey, field.name, e.target.value)
            }
          >
            <option value="">Select</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "api-select":
        return (
          <select
            className={styles.select}
            required={field.required}
            value={value}
            disabled={field.dependsOn && !sectionValues[field.dependsOn]}
            onChange={(e) =>
              updateField(sectionKey, field.name, e.target.value)
            }
          >
            <option value="">Select</option>
            {(apiOptions[field.name] || []).map((opt) => (
              <option
                key={opt[field.valueKey!]}
                value={opt[field.valueKey!]}
              >
                {opt[field.labelKey!]}
              </option>
            ))}
          </select>
        );

      case "multi-select-dropdown": {
        const sectionData = formData[sectionKey] || {};
        const selectedValues = Array.isArray(sectionData[field.name])
          ? sectionData[field.name]
          : [];

        const list = Array.isArray(apiOptions[field.name])
          ? apiOptions[field.name]
          : [];

        return (
          <div className={styles.dropdownContainer}>
            <div
              className={styles.dropdownHeader}
              onClick={() =>
                setOpenDropdown((prev) => ({
                  ...prev,
                  [field.name]: !prev[field.name],
                }))
              }
            >
              {selectedValues.length === 0
                ? field.label
                : `${selectedValues.length} selected`}
            </div>

            {openDropdown[field.name] && (
              <div className={styles.dropdownMenu}>
                {list.map((opt) => {
                  const optionValue =
                    opt[field.valueKey!] || opt.id;
                  const optionLabel =
                    opt[field.labelKey!] || opt.role;
                  const isChecked =
                    selectedValues.includes(optionValue);

                  return (
                    <div
                      key={optionValue}
                      className={styles.dropdownItem}
                      onClick={() => {
                        let updated = [...selectedValues];

                        if (isChecked) {
                          updated = updated.filter(
                            (v) => v !== optionValue
                          );
                        } else {
                          updated.push(optionValue);
                        }

                        updateField(
                          sectionKey,
                          field.name,
                          updated
                        );
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className={styles.dropdownCheckbox}
                      />
                      <span>{optionLabel}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      case "multi-select": {
        const sectionData = formData[sectionKey] || {};
        const selectedValues = Array.isArray(sectionData[field.name])
          ? sectionData[field.name]
          : [];

        const list = Array.isArray(apiOptions[field.name])
          ? apiOptions[field.name]
          : [];

        return (
          <div className={styles.multiCheckWrapper}>
            {list.map((opt) => {
              const optionValue = opt[field.valueKey!] || opt.id;
              const optionLabel = opt[field.labelKey!] || opt.role;

              return (
                <label
                  key={optionValue}
                  className={styles.multiCheckItem}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(optionValue)}
                    onChange={(e) => {
                      let updated = [...selectedValues];

                      if (e.target.checked) {
                        updated.push(optionValue);
                      } else {
                        updated = updated.filter(
                          (v) => v !== optionValue
                        );
                      }

                      updateField(
                        sectionKey,
                        field.name,
                        updated
                      );
                    }}
                  />
                  <span>{optionLabel}</span>
                </label>
              );
            })}
          </div>
        );
      }

      default:
        return null;
    }
  }

  // ------------------------------
  // Submit
  // ------------------------------
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData); // same structure as initialValues
  }

  return (
    <form className={styles.formWrapper} onSubmit={handleSubmit}>
      {sections.map((section) => (
        <div key={section.name} className={styles.card}>
          <h2 className={styles.sectionTitle}>{section.title}</h2>

          <div className={styles.grid}>
            {section.fields.map((field) => (
              <div className={styles.formGroup} key={field.name}>
                <label className={styles.label}>
                  {field.label}
                  {field.required && (
                    <span className={styles.required}> *</span>
                  )}
                </label>

                {renderField(section.objectKey, field)}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className={styles.submitArea}>
        <button
          className="btn btn-primary btn-md"
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
