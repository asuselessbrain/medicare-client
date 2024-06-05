import { Modal } from "flowbite-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BiErrorCircle } from "react-icons/bi";
import {
    CiBadgeDollar,
    CiCalendarDate,
    CiCircleCheck,
    CiLocationOn,
    CiStethoscope,
    CiUser,
} from "react-icons/ci";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

const CampCard = ({ camp, joinCamp }) => {
    const {
        _id,
        campName,
        image,
        participantCount,
        professionalsAttendanceCount,
        scheduledDate,
        scheduledTime,
        description,
        createdBy,
        specializedServices,
        targetAudience,
        venueLocation,
        fees,
    } = camp;
    const { user } = useAuth();
    const [openModal, setOpenModal] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const axios = useAxios();
    const onSubmit = async (data) => {
        const { name, email, phoneNumber, fee, gender, contact, age, address } = data;
        const newCampRegister = {
            name,
            email,
            phoneNumber,
            fee,
            gender,
            contact,
            age,
            address,
            campId: _id,
            campName,
            createdBy,
            image,
            venueLocation,
            scheduledDate,
            scheduledTime,
            paymentStatus: "pending",
            confirmationStatus: "pending",
        };

        const loadingToast = toast.loading("Registering Camp ... ");
        try {
            const { data } = await axios.post("/add-registered-camp", newCampRegister);
            console.log(data);
            if (data._id) {
                reset();
                setOpenModal(false);
                toast.dismiss(loadingToast);
                toast.success("Successfully created!");
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(error.code);
        }
    };
    function onCloseModal() {
        setOpenModal(false);
    }
    return (
        <div className="p-4">
            <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <img
                    className="lg:h-60 md:h-36 w-full object-cover object-center"
                    src={image}
                    alt="blog"
                />
                <div className="p-6">
                    <h2 className="flex items-center tracking-widest text-sm title-font font-medium text-gray-400 mb-1">
                        <CiLocationOn size={18} className="mr-2 inline" />
                        {venueLocation}
                    </h2>
                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                        {campName}
                    </h1>
                    <p className="leading-relaxed mb-3">
                        {description?.split(" ").slice(0, 20).join(" ")}
                    </p>
                    <div className="py-2">
                        <h2 className="flex items-center tracking-widest text-sm title-font font-medium text-gray-700 mb-1">
                            <div className="flex flex-wrap gap-2">
                                {specializedServices.map((service, idx) => {
                                    return (
                                        <span
                                            className="bg-gray-200 text-sm rounded px-1 py-0.5"
                                            key={idx}
                                        >
                                            {service}
                                        </span>
                                    );
                                })}
                            </div>
                        </h2>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <div>
                            <CiCircleCheck className="mr-2 inline" />
                            <span className="text-gray-400 text-sm">{targetAudience}</span>
                        </div>
                        <span className="text-gray-400 inline-flex items-center leading-none text-sm">
                            <CiStethoscope size={20} className="mr-2" />
                            {professionalsAttendanceCount}
                        </span>
                    </div>
                    <div className="flex items-center flex-wrap ">
                        <div className="flex items-center flex-wrap gap-2">
                            <div>
                                <CiCalendarDate size={20} className="mr-1 inline" />
                                <span className="text-xs text-gray-500">{scheduledDate}</span>
                            </div>
                            <div>
                                <CiCalendarDate size={20} className="mr-1 inline" />
                                <span className="text-xs text-gray-500">{scheduledTime}</span>
                            </div>
                        </div>
                        {fees ? (
                            <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                                <CiBadgeDollar size={20} className="mr-2" />
                                {fees}
                            </span>
                        ) : (
                            <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                                Free
                            </span>
                        )}
                        <span className="text-gray-400 inline-flex items-center leading-none text-sm">
                            <CiUser size={18} className="mr-2" />
                            {participantCount}
                        </span>
                    </div>
                    <div
                        className={`flex ${
                            joinCamp ? "justify-between" : "justify-center"
                        } items-center pt-5`}
                    >
                        <Link
                            to={`/camp-details/${_id}`}
                            className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0"
                        >
                            See Details
                            <svg
                                className="w-4 h-4 ml-2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 12h14" />
                                <path d="M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                        {joinCamp && (
                            <button
                                disabled={!user?.email}
                                onClick={() => setOpenModal(true)}
                                className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0"
                            >
                                Join Camp
                            </button>
                        )}
                    </div>
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
                                    <div className="col-span-full sm:col-span-2">
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Name
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            {...register("name", {
                                                required: "Name is required.",
                                                minLength: {
                                                    value: 5,
                                                    message:
                                                        "Name should be at least 5 characters.",
                                                },
                                                maxLength: {
                                                    value: 15,
                                                    message:
                                                        "Name should not exceed 15 characters.",
                                                },
                                            })}
                                            placeholder="Full Name"
                                            className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                            defaultValue={user?.displayName}
                                        />
                                        {errors.name && (
                                            <span className="text-center text-red-500 flex items-center gap-1">
                                                <BiErrorCircle
                                                    className="inline-block ml-2"
                                                    size={15}
                                                />
                                                {errors.name?.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-span-full sm:col-span-1">
                                        <label
                                            htmlFor="age"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Age
                                        </label>
                                        <input
                                            id="age"
                                            type="text"
                                            {...register("age", {
                                                required: "Age is required.",
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message:
                                                        "Please enter a valid age (numbers only).",
                                                },
                                                maxLength: {
                                                    value: 2,
                                                    message: "Age should not exceed 2 characters.",
                                                },
                                            })}
                                            placeholder="Your Age"
                                            className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                        />
                                        {errors.age && (
                                            <span className="text-center text-red-500 flex items-center gap-1">
                                                <BiErrorCircle
                                                    className="inline-block ml-2"
                                                    size={15}
                                                />
                                                {errors.age?.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-span-full sm:col-span-3">
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="Email"
                                            {...register("email", {
                                                required: "Email is Required",
                                                pattern: {
                                                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                                                    message: "Invalid Email format",
                                                },
                                            })}
                                            defaultValue={user?.email}
                                            className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                        />
                                        {errors.email && (
                                            <div className="text-md text-red-500">
                                                <span>{errors.email.message}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-full sm:col-span-2">
                                        <label
                                            htmlFor="gender"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Gender
                                        </label>
                                        <select
                                            id="gender"
                                            {...register("gender", {
                                                required: "Role is required.",
                                            })}
                                            className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                            defaultValue={"male"}
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                        {errors.gender && (
                                            <span className="text-center text-red-500 flex items-center gap-1">
                                                <BiErrorCircle
                                                    className="inline-block ml-2"
                                                    size={15}
                                                />
                                                {errors.gender?.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-span-full sm:col-span-2">
                                        <label
                                            htmlFor="phoneNumber"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Phone Number
                                        </label>
                                        <input
                                            id="phoneNumber"
                                            type="text"
                                            {...register("phoneNumber", {
                                                required: "Phone Number is required.",
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message:
                                                        "Please enter a valid age (numbers only).",
                                                },
                                                maxLength: {
                                                    value: 15,
                                                    message: "Age should not exceed 15 characters.",
                                                },
                                            })}
                                            placeholder="Your Phone Number"
                                            className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                        />
                                        {errors.phoneNumber && (
                                            <span className="text-center text-red-500 flex items-center gap-1">
                                                <BiErrorCircle
                                                    className="inline-block ml-2"
                                                    size={15}
                                                />
                                                {errors.phoneNumber?.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-span-full sm:col-span-2">
                                        <label
                                            htmlFor="fee"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Fee
                                        </label>
                                        <input
                                            id="fee"
                                            type="text"
                                            placeholder=""
                                            defaultValue={fees}
                                            readOnly
                                            {...register("fee", {
                                                required: "Fee is required.",
                                            })}
                                            className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                        />
                                        {errors.fees && (
                                            <span className="text-center text-red-500 flex items-center gap-1">
                                                <BiErrorCircle
                                                    className="inline-block ml-2"
                                                    size={15}
                                                />
                                                {errors.fees?.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-span-full sm:col-span-4">
                                        <label
                                            htmlFor="address"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Address
                                        </label>
                                        <input
                                            id="address"
                                            type="text"
                                            placeholder="Enter Your Address"
                                            {...register("address", {
                                                required: "Address is required.",
                                            })}
                                            className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                        />
                                        {errors.address && (
                                            <span className="text-center text-red-500 flex items-center gap-1">
                                                <BiErrorCircle
                                                    className="inline-block ml-2"
                                                    size={15}
                                                />
                                                {errors.address?.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-span-full sm:col-span-2">
                                        <label
                                            htmlFor="contact"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Emergency Contact
                                        </label>
                                        <input
                                            id="zip"
                                            type="text"
                                            {...register("contact", {
                                                required: "Address is required.",
                                            })}
                                            placeholder=""
                                            className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                        />
                                        {errors.contact && (
                                            <span className="text-center text-red-500 flex items-center gap-1">
                                                <BiErrorCircle
                                                    className="inline-block ml-2"
                                                    size={15}
                                                />
                                                {errors.contact?.message}
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

export default CampCard;
