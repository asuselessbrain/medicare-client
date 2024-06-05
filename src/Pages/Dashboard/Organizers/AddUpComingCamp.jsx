import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BiErrorCircle } from "react-icons/bi";
import { TagInput } from "rsuite";
import uploader from "../../../Utils/uploader";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import "./AddCamp.css";

const AddUpComingCamp = () => {
    const [specializedServices, setSpecializedServices] = useState([]);
    const { user } = useAuth();
    const axios = useAxios();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const onSubmit = async (data) => {
        const loadingToast = toast.loading("Camp Creating ... ");
        const {
            campName,
            fees,
            image,
            scheduledDate,
            scheduledTime,
            targetAudience,
            venueLocation,
            description,
        } = data;
        const imageFile = { image: image[0] };
        const imageResponse = await uploader({ imageFile });
        const newUpComingCamp = {
            campName,
            fees,
            image: imageResponse.data.display_url,
            scheduledDate,
            scheduledTime,
            targetAudience,
            venueLocation,
            description,
            specializedServices,
            createdBy: user.email,
        };
        try {
            const res = await axios.post("/add-upcoming-camp", newUpComingCamp);
            console.log(res.dada);
            toast.dismiss(loadingToast);
            toast.success("Successfully created!");
            reset();
            setSpecializedServices([]);
        } catch (error) {
            toast.dismiss(loadingToast);
            console.log(error);
        }
    };
    return (
        <div>
            <Helmet>
                <title>Dashboard | Add Up Comming Camp</title>
            </Helmet>
            <div className="flex items-center py-5">
                <h3 className="font-Quicksand text-primary/80 text-2xl font-bold">
                    Add a Up Coming Camp
                </h3>
            </div>
            <div className="bg-white rounded py-2 px-3">
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
                                    className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                />
                                {errors.campName && (
                                    <span className="text-center text-red-500 flex items-center gap-1">
                                        <BiErrorCircle className="inline-block ml-2" size={15} />
                                        {errors.campName?.message}
                                    </span>
                                )}
                            </div>
                            <div className="col-span-full sm:col-span-3">
                                <label
                                    htmlFor="phoneNumber"
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
                                        <BiErrorCircle className="inline-block ml-2" size={15} />
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
                                    {...register("description", {
                                        required: "Description is required.",
                                    })}
                                    className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                    cols="30"
                                    rows="10"
                                ></textarea>
                                {errors.description && (
                                    <span className="text-center text-red-500 flex items-center gap-1">
                                        <BiErrorCircle className="inline-block ml-2" size={15} />
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
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddUpComingCamp;
