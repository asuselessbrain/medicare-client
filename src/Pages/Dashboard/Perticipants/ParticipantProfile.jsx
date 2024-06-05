import { useQuery } from "@tanstack/react-query";
import { Modal } from "flowbite-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BiErrorCircle } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import uploader from "../../../Utils/uploader";
import Loader from "../../../components/Loader";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";

const ParticipantProfile = () => {
    const { user, userUpdate, userPasswordUpdate, setLoading } = useAuth();
    const axios = useAxios();
    const { data: profileAttendantCamp = [], isLoading } = useQuery({
        queryKey: ["profileAttendantCamp"],
        enabled: !!user?.email,
        queryFn: async () => {
            const { data } = await axios.get(`/registered-camps?email=${user?.email}`);
            return data;
        },
    });
    const [openModal, setOpenModal] = useState(false);
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
        const { name, image, password } = data;
        const imageFile = { image: image[0] };
        const loadingToast = toast.loading("Updating Register ... ");
        const res = await uploader({ imageFile });
        if (res.success == true) {
            try {
                const uploadedImageUrl = res.data.display_url;
                console.log(uploadedImageUrl);
                setOpenModal(false);
                await userUpdate(name, uploadedImageUrl);
                await userPasswordUpdate(password);
                toast.dismiss(loadingToast);
                toast.success("Successfully Updated!");
                setLoading(false);
                reset();
            } catch (error) {
                if (error.code === "auth/requires-recent-login") {
                    toast.dismiss(loadingToast);
                    setLoading(false);
                    return toast.success("Successfully Updated!");
                }
                toast.dismiss(loadingToast);
                toast.error(error.code);
                setLoading(false);
            }
        }
    };
    if (isLoading) {
        return <Loader/>
    }
    return (
        <div>
            <Helmet>
                <title>Dashboard | Participant Profile</title>
            </Helmet>
            <div className="bg-white rounded-lg shadow-xl pb-8">
                <div className="w-full h-[250px]">
                    <img
                        src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg"
                        className="w-full h-full rounded-tl-lg rounded-tr-lg"
                    />
                </div>
                <div className="flex flex-col items-center -mt-20">
                    <img
                        src={user?.photoURL}
                        className="w-40 h-40 border-4 border-white rounded-full"
                    />
                    <div className="flex items-center space-x-2 mt-2">
                        <p className="text-2xl">{user?.displayName}</p>
                    </div>
                    <p className="text-sm text-gray-500">Participant, MediCare</p>
                </div>
                <div className="flex-1 flex flex-col items-center lg:items-end justify-end px-8 mt-2">
                    <div className="flex items-center space-x-4 mt-2">
                        <button
                            onClick={() => setOpenModal(true)}
                            className="flex items-center bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100"
                        >
                            <CiEdit />
                            <span>Update</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="my-4 flex flex-col 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-4">
                <div className="w-full flex flex-col 2xl:w-1/3">
                    <div className="flex-1 bg-white rounded-lg shadow-xl p-8">
                        <h4 className="text-xl text-gray-900 font-bold">Personal Info</h4>
                        <ul className="mt-2 text-gray-700">
                            <li className="flex border-y py-2">
                                <span className="font-bold w-24">Full name:</span>
                                <span className="text-gray-700">{user?.displayName}</span>
                            </li>
                            <li className="flex border-b py-2">
                                <span className="font-bold w-24">Email:</span>
                                <span className="text-gray-700">{user?.email}</span>
                            </li>
                            <li className="flex border-b py-2">
                                <span className="font-bold w-24">Last Login:</span>
                                <span className="text-gray-700">
                                    {user?.metadata?.lastSignInTime}
                                </span>
                            </li>
                            <li className="flex border-b py-2">
                                <span className="font-bold w-24">Joined:</span>
                                <span className="text-gray-700">
                                    {user?.metadata?.creationTime}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="my-4 flex flex-col 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-4">
                <div className="w-full flex flex-col 2xl:w-1/3">
                    <div className="flex-1 bg-white rounded-lg shadow-xl p-8">
                        <h4 className="text-xl text-gray-900 font-bold">Attended Camps</h4>
                        <ul className="mt-2 text-gray-700">
                            {profileAttendantCamp.slice(0,5).map((camp) => (
                                <li key={camp._id} className="flex gap-5 border-y py-2">
                                    <span className="font-bold">CampName: <span className="text-gray-700 font-normal">{camp?.name}</span></span>
                                    <span className="font-bold">Venue: <span className="text-gray-700 font-normal">{camp?.venueLocation}</span></span>
                                    <span className="font-bold">Scheduled Date: <span className="text-gray-700 font-normal">{new Date(camp?.scheduledDate).toDateString()}</span></span>
                                </li>
                            ))}
                        </ul>
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
                                    <div className="col-span-full sm:col-span-3">
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
                                    <div className="col-span-full sm:col-span-3">
                                        <label
                                            htmlFor="phoneNumber"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Profile Picture
                                        </label>
                                        <input
                                            type="file"
                                            {...register("image", {
                                                required: "Profile Picture is required.",
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
                                    <div className="col-span-full">
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
                                            readOnly
                                            defaultValue={user?.email}
                                            className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                        />
                                        {errors.email && (
                                            <div className="text-md text-red-500">
                                                <span>{errors.email.message}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-full">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            {...register("password", {
                                                required: "Password is required.",
                                                minLength: {
                                                    value: 6,
                                                    message:
                                                        "Password must be at least 6 characters long.",
                                                },
                                                pattern: {
                                                    value: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/,
                                                    message:
                                                        "Invalid password: no capitals, specials or numbers.",
                                                },
                                            })}
                                            className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                            autoComplete="current-password"
                                        />
                                        {errors.password && (
                                            <span className="text-center text-red-500 flex items-center gap-1">
                                                <BiErrorCircle
                                                    className="inline-block ml-2"
                                                    size={15}
                                                />
                                                {errors.password?.message}
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

export default ParticipantProfile;
