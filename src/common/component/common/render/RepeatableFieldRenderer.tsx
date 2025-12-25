import React from "react";
import {CommonField} from "./CommonField.tsx";
import {TextareaField} from "./TextareaField.tsx";
import {SelectField} from "./SelectField.tsx";
import {ApiSelectField} from "./ApiSelectField.tsx";
import {PageableApiSelectionField} from "./PageableApiSelectinoField.tsx";
import type {FormSection} from "../../../lib/FormSection.ts";
import type {FormField} from "../../../lib/FormField.ts";

interface Props {
    section: FormSection;
    field: FormField;
    value: any;
    onChange: (val: any) => void;

    apiOptions: Record<string, any>;
    fetchOptions: Function;
    formData: Record<string, any>;
}

export const RepeatableFieldRenderer: React.FC<Props> = ({
                                                             section,
                                                             field,
                                                             value,
                                                             onChange,
                                                             apiOptions,
                                                             fetchOptions,
                                                             formData,
                                                         }) => {
    switch (field.type) {
        case "text":
        case "email":
        case "password":
        case "number":
        case "date":
            return (
                <CommonField
                    type={field.type}
                    value={value}
                    required={field.required}
                    onChange={onChange}
                />
            );

        case "textarea":
            return (
                <TextareaField
                    value={value}
                    required={field.required}
                    onChange={onChange}
                />
            );

        case "select":
            return (
                <SelectField
                    value={value}
                    required={field.required}
                    options={field.options || []}
                    onChange={onChange}
                />
            );

        case "api-select": {
            const state = apiOptions[field.name];
            return (
                <ApiSelectField
                    value={value}
                    required={field.required}
                    options={state?.items ?? []}
                    valueKey={field.valueKey!}
                    labelKey={field.labelKey!}
                    fallbackLabel={
                        field.updateShowField
                            ? formData[field.updateShowField]
                            : undefined
                    }
                    onChange={onChange}
                />
            );
        }

        case "page-api-select": {
            const state = apiOptions[field.name];

            React.useEffect(() => {
                // 🔥 initial fetch (once)
                if (!state || state.items.length === 0) {
                    fetchOptions({
                        field,
                        url: field.api!.replace(
                            "{companyId}",
                            formData.__meta__.companyId
                        ),
                        page: 0,
                        search: "",
                        append: false,
                    });
                }
            }, []); // 👈 run once

            return (
                <PageableApiSelectionField
                    value={value}
                    optionsState={state}
                    valueKey={field.valueKey!}
                    labelKey={field.labelKey!}
                    fallbackLabel={
                        field.updateShowField
                            ? formData[field.updateShowField]
                            : undefined
                    }
                    onChange={onChange}
                    onSearch={(search) =>
                        fetchOptions({
                            field,
                            url: field.api!.replace(
                                "{companyId}",
                                formData.__meta__.companyId
                            ),
                            page: 0,
                            search,
                            append: false,
                        })
                    }
                    onLoadMore={() => {
                        if (!state || !state.hasMore || state.loading) return;

                        fetchOptions({
                            field,
                            url: field.api!.replace(
                                "{companyId}",
                                formData.__meta__.companyId
                            ),
                            page: state.page + 1,
                            search: state.search,
                            append: true,
                        });
                    }}
                />
            );
        }


        default:
            return null;
    }
};