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
import { TagInput } from "rsuite";
import Swal from "sweetalert2";
import uploader from "../../../Utils/uploader";
import Loader from "../../../components/Loader";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";

const ManageCamps = () => {
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState({});
    const [specializedServices, setSpecializedServices] = useState(modalData.specializedServices);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const axios = useAxios();
    const { user } = useAuth();
    const {
        data: manageCamps = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["manageCamps"],
        enabled: !!user?.email,
        queryFn: async () => {
            const { data } = await axios.get(`/camps?createdBy=${user?.email}`);
            return data;
        },
    });
    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState("");
    const data = useMemo(() => manageCamps, [manageCamps]);
    /** @type import('@tanstack/react-table').ColumnDef<any> */
    const columns = [
        {
            header: "Name",
            accessorKey: "campName",
        },
        {
            header: "Fees",
            accessorKey: "fees",
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
            header: "Target Audience",
            accessorKey: "targetAudience",
        },
        {
            header: "Venue Location",
            accessorKey: "venueLocation",
        },
        {
            header: "Status",
            accessorKey: "status",
        },
        {
            header: "Edit",
            accessor: "_id",
            cell: ({ cell: { row } }) => (
                <button key={row.original._id} onClick={() => handleOpenModal(row.original)}>
                    Edit
                </button>
            ),
        },
        {
            header: "Delete",
            accessorKey: "_id",
            cell: ({ cell: { row } }) => (
                <button
                    onClick={() => handleDelete(row.original._id)}
                    className="bg-red-600 rounded text-white px-1 py-0.5 "
                >
                    Delete
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
    const handleDelete = async (id) => {
        try {
            const swalConfirm = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });
            if (swalConfirm.isConfirmed) {
                await axios.delete(`/delete-camp/${id}`);
                refetch();
                Swal.fire({
                    title: "Deleted!",
                    text: "Your Camp has been deleted.",
                    icon: "success",
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    if (isLoading) {
        <Loader />;
    }
    const onSubmit = async (data) => {
        const loadingToast = toast.loading("Camp Updating ... ");
        const {
            campName,
            fees,
            image,
            scheduledDate,
            scheduledTime,
            targetAudience,
            venueLocation,
            description,
            status,
        } = data;
        const imageFile = { image: image[0] };
        const imageResponse = await uploader({ imageFile });
        const updatedCamp = {
            campName,
            fees,
            image: imageResponse.data.display_url,
            scheduledDate,
            scheduledTime,
            targetAudience,
            venueLocation,
            description,
            specializedServices,
            status,
        };
        try {
            await axios.put(`/update-camp/${modalData._id}`, updatedCamp);
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
                <title>Dashboard | Manage Camps</title>
            </Helmet>
            <div className="flex justify-between items-center py-5">
                <h3 className="font-Quicksand text-primary/80 text-2xl font-bold">Manage Camps</h3>
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
            <Modal show={openModal} size="4xl" onClose={onCloseModal} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                            Camp Registration
                        </h3>
                        <form
                            className="container flex flex-col mx-auto space-y-12"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900">
                                <div className="grid grid-cols-6 gap-4 col-span-full">
                                    <div className="col-span-full sm:col-span-3">
                                        <label
                                            htmlFor="campName"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Camp Name
                                        </label>
                                        <input
                                            id="campName"
                                            type="text"
                                            {...register("campName", {
                                                required: "Name is required.",
                                            })}
                                            placeholder="Camp Name"
                                            defaultValue={modalData.campName}
                                            className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                        />
                                        {errors.campName && (
                                            <span className="text-center text-red-500 flex items-center gap-1">
                                                <BiErrorCircle
                                                    className="inline-block ml-2"
                                                    size={15}
                                                />
                                                {errors.campName?.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-span-full sm:col-span-3">
                                        <label
                                            htmlFor="campName"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            id="status"
                                            {...register("status", {
                                                required: "Status is required.",
                                            })}
                                            placeholder="Camp Status"
                                            defaultValue={modalData.status}
                                            className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                        >
                                            <option value="active">Active</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                        {errors.status && (
                                            <span className="text-center text-red-500 flex items-center gap-1">
                                                <BiErrorCircle
                                                    className="inline-block ml-2"
                                                    size={15}
                                                />
                                                {errors.status?.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-span-full">
                                        <label
                                            htmlFor="image"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Image
                                        </label>
                                        <input
                                            type="file"
                                            {...register("image", {
                                                required: "Image is required.",
                                                validate: (value) => {
                                                    const acceptFormat = ["png", "jpg", "jpeg"];
                                                    const fileExtension = value[0]?.name
                                                        .split(".")
                                                        .pop()
                                                        .toLowerCase();
                                                    if (!acceptFormat.includes(fileExtension)) {
                                                        return "Invalid file. Select .png, .jpg, .jpeg only.";
                                                    }
                                                    return true;
                                                },
                                            })}
                                            accept="image/png, image/jpeg"
                                            className="w-full block border bg-white placeholder-gray-500 leading-5 rounded-lg border-gray-200 focus:border-blue-500 px-2"
                                        />
                                        {errors.image && (
                                            <span className="text-center text-red-500 flex items-center gap-1">
                                                <BiErrorCircle
                                                    className="inline-block ml-2"
                                                    size={15}
                                                />
                                                {errors.image?.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-span-full sm:col-span-2">
                                        <label
                                            htmlFor="fee"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Camp Fees
                                        </label>
                                        <input
                                            id="fees"
                                            type="number"
                                            placeholder="Fees"
                                            {...register("fees", {
                                                required: "Fees is Required",
                                            })}
                                            defaultValue={modalData.fees}
                                            className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                        />
                                        {errors.fees && (
                                            <div className="text-md text-red-500">
                                                <span>{errors.fees?.message}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-full sm:col-span-2">
                                        <label
                                            htmlFor="scheduledDate"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Scheduled Date
                                        </label>
                                        <input
                                            id="scheduledDate"
                                            type="date"
                                            placeholder="Enter Scheduled Date"
                                            {...register("scheduledDate", {
                                                required: "Email is Required",
                                            })}
                                            defaultValue={modalData.scheduledDate}
                                            className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                        />
                                        {errors.scheduledDate && (
                                            <div className="text-md text-red-500">
                                                <span>{errors.scheduledDate?.message}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-full sm:col-span-2">
                                        <label
                                            htmlFor="scheduledTime"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Scheduled Time
                                        </label>
                                        <input
                                            id="scheduledTime"
                                            type="time"
                                            placeholder="Enter Scheduled Date"
                                            {...register("scheduledTime", {
                                                required: "Time is Required",
                                            })}
                                            defaultValue={modalData.scheduledTime}
                                            className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                        />
                                        {errors.scheduledTime && (
                                            <div className="text-md text-red-500">
                                                <span>{errors.scheduledTime?.message}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-full sm:col-span-2">
                                        <label
                                            htmlFor="venueLocation"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Venue Location
                                        </label>
                                        <input
                                            id="venueLocation"
                                            type="text"
                                            placeholder="Enter Venue Location"
                                            {...register("venueLocation", {
                                                required: "Venue Location is Required",
                                            })}
                                            defaultValue={modalData.venueLocation}
                                            className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                        />
                                        {errors.venueLocation && (
                                            <div className="text-md text-red-500">
                                                <span>{errors.venueLocation?.message}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-full sm:col-span-2">
                                        <label
                                            htmlFor="scheduledDate"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Specialized Services
                                        </label>
                                        <TagInput
                                            trigger={"Enter"}
                                            placeholder="Enter Services"
                                            style={{ width: 300 }}
                                            defaultValue={modalData.specializedServices}
                                            className="w-full outline-none transition-colors duration-300 py-1.5"
                                            menuStyle={{ width: 300 }}
                                            onCreate={(value) => {
                                                setSpecializedServices(value);
                                            }}
                                        />
                                        {errors.specializedServices && (
                                            <div className="text-md text-red-500">
                                                <span>{errors.specializedServices.message}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-full sm:col-span-2">
                                        <label
                                            htmlFor="targetAudience"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Target Audience
                                        </label>
                                        <input
                                            id="targetAudience"
                                            type="text"
                                            placeholder="Target Audience"
                                            {...register("targetAudience", {
                                                required: "TargetAudience is Required",
                                            })}
                                            defaultValue={modalData.targetAudience}
                                            className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                        />
                                        {errors.targetAudience && (
                                            <div className="text-md text-red-500">
                                                <span>{errors.targetAudience.message}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-full">
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            type="text"
                                            id="description"
                                            defaultValue={modalData.description}
                                            {...register("description", {
                                                required: "Description is required.",
                                            })}
                                            className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                            cols="30"
                                            rows="10"
                                        ></textarea>
                                        {errors.description && (
                                            <span className="text-center text-red-500 flex items-center gap-1">
                                                <BiErrorCircle
                                                    className="inline-block ml-2"
                                                    size={15}
                                                />
                                                {errors.description?.message}
                                            </span>
                                        )}
                                    </div>
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

export default ManageCamps;
