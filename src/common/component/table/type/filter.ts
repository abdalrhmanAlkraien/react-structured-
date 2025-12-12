export type FilterField =
    | {
    id: string;              // ✅ UNIQUE RENDER KEY
    type: "text";
    name: string;
    label: string;
}
    | {
    id: string;              // ✅ UNIQUE RENDER KEY
    type: "select";
    name: string;
    label: string;
    options: string[];
}
    | {
    id: string;              // ✅ UNIQUE RENDER KEY
    type: "boolean";
    name: string;
    label: string;
}
    | {
    id: string;              // ✅ UNIQUE RENDER KEY
    type: "date";
    name: string;
    label: string;
}
    | {
    id: string;              // ✅ UNIQUE RENDER KEY
    type: "api-select";
    name: string;
    label: string;
    api: string; // endpoint
    dependsOn?: string; // for city => depends on country
    valueKey: string; // for city => id
    labelKey: string; // for city => name
};
