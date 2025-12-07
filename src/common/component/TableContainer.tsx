import {type Column, DataTable} from "./DataTable.tsx";
import {useEffect, useState} from "react";
import {Pagination} from "./Pagination.tsx";


interface TableContainerProps<T> {
    columns: Column<T>[];
    fetchData: (page: number, size: number) => Promise<any>;
    pageSize?: number;
    reloadFlag: number
}

export function TableContainer<T>({
                                      columns,
                                      fetchData,
                                      pageSize = 20,
                                      reloadFlag
                                  }: TableContainerProps<T>) {

    const [rows, setRows] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        load();
    }, [page, reloadFlag]);

    async function load() {
        setLoading(true);

        const response = await fetchData(page, pageSize);

        setRows(response.content);
        setTotalPages(response.totalPages);
        setLoading(false);
    }

    return (
        <>
            <DataTable<T> columns={columns} data={rows} loading={loading} />
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </>
    );
}