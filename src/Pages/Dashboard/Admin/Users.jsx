import { useQuery } from "@tanstack/react-query";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Modal } from "flowbite-react";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BiErrorCircle } from "react-icons/bi";
import { PiPencilLineLight } from "react-icons/pi";
import Loader from "../../../components/Loader";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";

const Users = () => {
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState({});

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const axios = useAxios();
    const { user } = useAuth();
    const {
        data: allUsers = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["allUsers"],
        enabled: !!user?.email,
        queryFn: async () => {
            const { data } = await axios.get("/get-users");
            return data;
        },
    });
    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState("");
    const data = useMemo(() => allUsers, [allUsers]);
    /** @type import('@tanstack/react-table').ColumnDef<any> */
    const columns = [
        {
            header: "Name",
            accessorKey: "name",
        },
        {
            header: "email",
            accessorKey: "email",
        },
        {
            header: "role",
            accessorKey: "role",
        },
        {
            header: "created At",
            accessorKey: "createdAt",
            cell: ({ cell: { row } }) => (
                <span>{new Date(row.original.createdAt).toLocaleString()}</span>
            ),
        },
        {
            header: "last Sign In",
            accessorKey: "lastSignInTime",
            cell: ({ cell: { row } }) => (
                <span>{new Date(row.original.lastSignInTime).toLocaleString()}</span>
            ),
        },
        {
            header: "Action",
            accessor: "_id",
            cell: ({ cell: { row } }) => (
                <button
                    onClick={() => handleOpenModal(row.original)}
                    className="px-1 py-0.5 "
                >
                    <PiPencilLineLight size={20} className="inline text-blue-500" />
                </button>
            ),
        },
    ];
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
    function handleOpenModal(value) {
        setModalData(value);
        setOpenModal(true);
    }
    function onCloseModal() {
        setModalData({});
        setOpenModal(false);
        reset();
    }
    if (isLoading) {
        <Loader />;
    }
    const onSubmit = async (data) => {
        const loadingToast = toast.loading("User Updating ... ");
        try {
            await axios.put(`/update-user/${modalData._id}`, data);
            toast.dismiss(loadingToast);
            toast.success("Successfully created!");
            setOpenModal(false);
            refetch();
            reset();
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <Helmet>
                <title>Dashboard | Manage Users</title>
            </Helmet>
            <div className="flex justify-between items-center py-5">
                <h3 className="font-Quicksand text-primary/80 text-2xl font-bold">Manage Users</h3>
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
                                                    { asc: "🔼", desc: "🔽" }[
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
            <Modal show={openModal} size="xl" onClose={onCloseModal} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                            Edit Users
                        </h3>
                        <form
                            className="container flex flex-col mx-auto space-y-12"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900">
                                <div className="col-span-full">
                                    <label
                                        htmlFor="role"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Role
                                    </label>
                                    <select
                                        name="role"
                                        id="role"
                                        {...register("role", {
                                            required: "role is required.",
                                        })}
                                        defaultValue={modalData.role}
                                        className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                    >
                                        <option value="organizer">Organizer</option>
                                        <option value="healthcare_professional">
                                            Healthcare Professional
                                        </option>
                                        <option value="participant">Participant</option>
                                    </select>
                                    {errors.role && (
                                        <span className="text-center text-red-500 flex items-center gap-1">
                                            <BiErrorCircle
                                                className="inline-block ml-2"
                                                size={15}
                                            />
                                            {errors.role?.message}
                                        </span>
                                    )}
                                </div>
                            </fieldset>
                            <button
                                type="submit"
                                className="mx-auto rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary/95 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary/90 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary/90"
                            >
                                Update
                            </button>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Users;
