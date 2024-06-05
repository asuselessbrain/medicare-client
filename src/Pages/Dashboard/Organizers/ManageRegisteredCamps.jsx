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
import Swal from "sweetalert2";
import Loader from "../../../components/Loader";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";

const ManageRegisteredCamps = () => {
    const axios = useAxios();
    const { user } = useAuth();
    const {
        data: manageRegisteredCamps = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["manageRegisteredCamps"],
        enabled: !!user?.email,
        queryFn: async () => {
            const { data } = await axios.get(`/registered-camps?createdBy=${user?.email}`);
            return data;
        },
    });
    console.log(manageRegisteredCamps);
    const data = useMemo(() => manageRegisteredCamps, [manageRegisteredCamps]);
    /** @type import('@tanstack/react-table').ColumnDef<any> */
    const columns = [
        {
            header: "Name",
            accessorKey: "campName",
        },
        {
            header: "Fees",
            accessorKey: "fee",
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
            header: "Venue",
            accessorKey: "venueLocation",
        },
        {
            header: "Confirm Status",
            accessorKey: "confirmationStatus",
            cell: ({ cell: { row } }) => (
                <button
                    onClick={() => handleConfirm(row.original._id, row.original.campId)}
                    className={`${
                        row.original.confirmationStatus === "approved"
                            ? "bg-green-600 rounded disabled:bg-green-500"
                            : "bg-red-600 rounded disabled:bg-red-500"
                    } text-white px-1 py-0.5 `}
                    disabled={
                        row.original.paymentStatus === "pending" ||
                        row.original.confirmationStatus === "approved"
                    }
                >
                    {row.original.confirmationStatus === "approved" ? "Approved" : "Pending"}
                </button>
            ),
        },
        {
            header: "Payment Status",
            accessorKey: "paymentStatus",
            cell: ({ cell: { row } }) => (
                <span
                    className={`${
                        row.original.paymentStatus === "approved"
                            ? "bg-green-600 rounded disabled:bg-green-500"
                            : "bg-red-600 rounded disabled:bg-red-500"
                    } text-white px-1 py-0.5 `}
                >
                    {row.original.paymentStatus === "approved" ? "Paid" : "Unpaid"}
                </span>
            ),
        },
        {
            header: "Action",
            accessorKey: "_id",
            cell: ({ cell: { row } }) => (
                <button
                    disabled={
                        row.original.paymentStatus === "pending" ||
                        row.original.confirmationStatus === "approved"
                    }
                    onClick={() => handleCancel(row.original._id)}
                    className="bg-red-600 rounded disabled:bg-red-500 text-white px-1 py-0.5 "
                >
                    Cancel
                </button>
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
    const handleConfirm = async (id, campId) => {
        try {
            const swalConfirm = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Approve!",
            });
            if (swalConfirm.isConfirmed) {
                await axios.put(`/update-registered-camp/${id}?confirmationStatus=approved`);
                await axios.put(`/update-camp-participant-count/${campId}`);
                refetch();
                Swal.fire({
                    title: "Approved!",
                    text: "Your Perticipants has been approved.",
                    icon: "success",
                });
            }
        } catch (error) {
            console.log(error);
        }
        refetch();
    };
    const handleCancel = async (id) => {
        try {
            const swalConfirm = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Cancel!",
            });
            if (swalConfirm.isConfirmed) {
                await axios.put(`/update-registered-camp/${id}?confirmationStatus=canceled`);
                refetch();
                Swal.fire({
                    title: "Canceled!",
                    text: "Your Perticipants has been Canceled.",
                    icon: "success",
                });
            }
        } catch (error) {
            console.log(error);
        }
        refetch();
    };
    if (isLoading) {
        return <Loader />;
    }
    return (
        <div>
            <Helmet>
                <title>Dashboard | Manage Registered Camps</title>
            </Helmet>
            <div className="flex justify-between items-center py-5">
                <h3 className="font-Quicksand text-primary/80 text-2xl font-bold">
                    Manage Registered Camps
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

export default ManageRegisteredCamps;
