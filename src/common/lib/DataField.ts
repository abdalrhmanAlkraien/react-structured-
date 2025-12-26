export interface DetailField {
    label: string;
    accessor: string; // supports dot-path
}

export interface DetailSection {
    title: string;
    accessor?: string; // object root, e.g. "customer"
    fields?: DetailField[];

    repeatable?: boolean;
    columns?: DetailField[]; // for lists
}
