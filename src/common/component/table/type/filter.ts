export type FilterField =
    | {
    type: "text";
    name: string;
    label: string;
}
    | {
    type: "select";
    name: string;
    label: string;
    options: string[];
}
    | {
    type: "boolean";
    name: string;
    label: string;
}
    | {
    type: "date";
    name: string;
    label: string;
}
    | {
    type: "api-select";
    name: string;
    label: string;
    api: string; // endpoint
    dependsOn?: string; // for city => depends on country
    valueKey: string; // for city => id
    labelKey: string; // for city => name
};
