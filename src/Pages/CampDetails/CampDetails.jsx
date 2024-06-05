import { Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BiErrorCircle } from "react-icons/bi";
import { CiBadgeDollar, CiCircleCheck, CiLocationOn, CiStethoscope, CiUser } from "react-icons/ci";
import { useLoaderData } from "react-router-dom";
import Container from "../../components/Container";
import useAdmin from "../../hooks/useAdmin";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import useOrganizer from "../../hooks/useOrganizer";
import useProfessional from "../../hooks/useProfessional";

const CampDetails = () => {
    const { data: camp = {} } = useLoaderData();
    const { user } = useAuth();
    const [openModal, setOpenModal] = useState(false);
    const axios = useAxios();
    const [admin] = useAdmin();
    const [professional] = useProfessional();
    const [organizer] = useOrganizer();
    const {
        _id,
        campName,
        image,
        participantCount,
        professionalsAttendanceCount,
        scheduledDate,
        scheduledTime,
        description,
        specializedServices,
        targetAudience,
        createdBy,
        venueLocation,
        fees,
    } = camp;
    function onCloseModal() {
        setOpenModal(false);
    }

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const onSubmit = async (data) => {
        console.log(data);
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
            image,
            venueLocation,
            createdBy,
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
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <Container>
            <Helmet>
                <title>MediCare | {camp.campName}</title>
            </Helmet>
            <div className="mx-auto max-w-screen-xl pt-28 text-center">
                <p className="text-gray-500">
                    Published {scheduledDate} {scheduledTime}
                </p>
                <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-5xl">{campName}</h1>
                <h2 className="flex justify-center items-center tracking-widest text-sm title-font font-medium text-gray-400 py-2">
                    <CiLocationOn size={18} className="mr-2 inline" />
                    {venueLocation}
                </h2>
                <div className="flex justify-center items-center flex-wrap gap-5">
                    <div className="flex gap-5 items-center py-2">
                        <div>
                            <CiCircleCheck className="mr-2 inline" />
                            <span className="text-gray-400 text-sm">{targetAudience}</span>
                        </div>
                        <span className="text-gray-400 inline-flex items-center leading-none text-sm">
                            <CiStethoscope size={20} className="mr-2" />
                            {professionalsAttendanceCount}
                        </span>
                    </div>
                    <div>
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
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Tags">
                    {specializedServices.map((service, idx) => {
                        return (
                            <button
                                key={idx}
                                className="rounded-lg bg-gray-100 px-2 py-1 font-medium text-gray-600 hover:bg-gray-200"
                            >
                                {service}
                            </button>
                        );
                    })}
                </div>
            </div>
            <article className="max-w-screen-lg mx-auto">
                <img
                    className="sm:h-[30rem] rounded-xl mt-10 w-full"
                    src={image}
                    alt="Featured Image"
                />
                <div className="mt-5 max-w-screen-lg space-y-12 px-4 py-10 font-serif text-lg tracking-wide text-gray-700">
                    <strong className="text-2xl font-medium">{description}</strong>
                </div>
                <div className="flex justify-center items-center py-5">
                    <button
                        disabled={!user || admin || organizer || professional}
                        onClick={() => setOpenModal(true)}
                        className="text-white disabled:bg-gradient-to-br disabled:from-slate-400 disabled:via-slate-700 disabled:to-slate-900 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                        Join Camp
                    </button>
                </div>
            </article>
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
        </Container>
    );
};

export default CampDetails;
