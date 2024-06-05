import { Rating } from "@smastrom/react-rating";
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
import Loader from "../../../components/Loader";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";

const FeedbackAndRatings = () => {
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState({});
    const [rating, setRating] = useState(0);
    const axios = useAxios();
    const { user } = useAuth();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const {
        data: FeedbackAndRatings = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["FeedbackAndRatings"],
        enabled: !!user?.email,
        queryFn: async () => {
            const { data } = await axios.get(
                `/registered-camps?email=${user?.email}&paymentStatus=approved&confirmationStatus=approved`
            );
            return data;
        },
    });
    const data = useMemo(() => FeedbackAndRatings, [FeedbackAndRatings]);
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
                <span
                    className={`${
                        row.original.confirmationStatus === "approved"
                            ? "bg-green-600 rounded disabled:bg-green-500"
                            : "bg-red-600 rounded disabled:bg-red-500"
                    } text-white px-1 py-0.5 `}
                >
                    {row.original.confirmationStatus === "approved" ? "Approved" : "Pending"}
                </span>
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
                    key={row.original._id}
                    onClick={() => handleOpenModal(row.original)}
                    className="bg-blue-600 rounded disabled:bg-gray-500 text-white px-1 py-0.5 "
                >
                    Review
                </button>
            ),
        },
    ];
    function handleOpenModal(value) {
        setModalData(value);
        setOpenModal(true);
    }
    function onCloseModal() {
        setModalData({});
        setOpenModal(false);
        reset();
    }
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
    const onSubmit = async (data) => {
        const loadingToast = toast.loading("Creating Review ... ");
        const newReview = {
            camp_name: modalData.campName,
            date: modalData.scheduledDate,
            participant_name: modalData.name,
            participant_image: user?.photoURL,
            ...data,
            status: "pending",
            rating,
        };
        try {
            await axios.post("/add-review", newReview);
            toast.dismiss(loadingToast);
            toast.success("Successfully created!");
            setOpenModal(false);
            refetch();
            reset();
        } catch (error) {
            console.log(error);
        }
    };
    if (isLoading) {
        return <Loader />;
    }
    return (
        <div>
            <Helmet>
                <title>Dashboard | Feedback And Ratings</title>
            </Helmet>
            <div className="flex justify-between items-center py-5">
                <h3 className="font-Quicksand text-primary/80 text-2xl font-bold">
                    Registered Camps
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
                <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
            <Modal show={openModal} size="xl" onClose={onCloseModal} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                            Give your feedback here.
                        </h3>
                        <div className="flex justify-center items-center py-3">
                            <Rating
                                style={{ maxWidth: 180 }}
                                value={rating}
                                onChange={setRating}
                                isRequired
                            />
                        </div>
                        <form
                            className="container flex flex-col mx-auto space-y-12"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900">
                                <div className="grid grid-cols-6 gap-4 col-span-full">
                                    <div className="col-span-full">
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Write you feedback
                                        </label>
                                        <textarea
                                            name="feedback"
                                            type="text"
                                            id="feedback"
                                            {...register("feedback", {
                                                required: "Feedback is required.",
                                            })}
                                            className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                            cols="30"
                                            rows="5"
                                        ></textarea>
                                        {errors.feedback && (
                                            <span className="text-center text-red-500 flex items-center gap-1">
                                                <BiErrorCircle
                                                    className="inline-block ml-2"
                                                    size={15}
                                                />
                                                {errors.feedback?.message}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </fieldset>
                            <button
                                type="submit"
                                className="mx-auto rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary/95 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary/90 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary/90"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default FeedbackAndRatings;
