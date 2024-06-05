import { useQuery } from "@tanstack/react-query";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import Loader from "../../../components/Loader";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";

const PaymentHistory = () => {
    const axios = useAxios();
    const { user } = useAuth();
    const { data: manageRegisteredCamps = [], isLoading } = useQuery({
        queryKey: ["paymentsHistory"],
        enabled: !!user?.email,
        queryFn: async () => {
            const { data } = await axios.get(`/payments?email=${user?.email}`);
            return data;
        },
    });
    const data = useMemo(() => manageRegisteredCamps, [manageRegisteredCamps]);
    /** @type import('@tanstack/react-table').ColumnDef<any> */
    const columns = [
        {
            header: "Camp Name",
            accessorKey: "campName",
        },
        {
            header: "Scheduled Date",
            accessorKey: "scheduledDate",
            cell: ({ cell: { row } }) => (
                <span>
                    {new Date(row.original.scheduledDate).toLocaleDateString()}
                </span>
            ),
        },
        {
            header: "Scheduled Time",
            accessorKey: "scheduledTime",
        },
        {
            header: "Fees",
            accessorKey: "Fees",
        },
        {
            header: "Venue",
            accessorKey: "venueLocation",
        },
        {
            header: "Payment Status",
            accessorKey: "PaymentStatus",
            cell: ({ cell: { row } }) => (
                <span
                    className={`${
                        row.original.PaymentStatus === "confirmed"
                            ? "bg-green-600 rounded disabled:bg-green-500"
                            : "bg-red-600 rounded disabled:bg-red-500"
                    } text-white px-1 py-0.5 `}
                >
                    {row.original.PaymentStatus === "confirmed" ? "Paid" : "Unpaid"}
                </span>
            ),
        },
        {
            header: "Confirm Status",
            accessorKey: "ConfirmationStatus",
            cell: ({ cell: { row } }) => (
                <span
                    className={`${
                        row.original.ConfirmationStatus === "confirmed"
                            ? "bg-green-600 rounded disabled:bg-green-500"
                            : "bg-red-600 rounded disabled:bg-red-500"
                    } text-white px-1 py-0.5 `}
                >
                    {row.original.ConfirmationStatus === "confirmed" ? "Confirmed" : "Pending"}
                </span>
            ),
        },
    ];
    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState("");
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting: sorting,
            globalFilter: filtering,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
    });

    if (isLoading) {
        return <Loader />;
    }
    return (
        <div>
            <Helmet>
                <title>Dashboard | Payment History</title>
            </Helmet>
            <div className="flex justify-between items-center py-5">
                <h3 className="font-Quicksand text-primary/80 text-2xl font-bold">
                    Payment History
                </h3>
                <div className="block relative">
                    <input
                        placeholder="Search"
                        value={filtering}
                        onChange={(e) => setFiltering(e.target.value)}
                        className="p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                    />
                </div>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        scope="col"
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="px-6 py-3"
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div>
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {
                                                    { asc: "⇈", desc: "⇅" }[
                                                        header.column.getIsSorted() ?? null
                                                    ]
                                                }
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-6 py-4">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                <div className="inline-flex mt-2 xs:mt-0">
                    <button
                        onClick={() => table.setPageIndex(0)}
                        className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l"
                    >
                        First
                    </button>
                    <button
                        disabled={!table.getCanPreviousPage()}
                        onClick={() => table.previousPage()}
                        className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4"
                    >
                        Prev
                    </button>
                    <button
                        disabled={!table.getCanNextPage()}
                        onClick={() => table.nextPage()}
                        className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4"
                    >
                        Next
                    </button>
                    <button
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r"
                    >
                        Last
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;
