import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BiErrorCircle } from "react-icons/bi";
import uploader from "../../../Utils/uploader";
import Loader from "../../../components/Loader";
import useAxios from "../../../hooks/useAxios";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const Settings = () => {
    const axios = useAxiosPublic();
    const axiosSecure = useAxios()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const { data: settings = {}, isLoading } = useQuery({
        queryKey: ["settings"],
        queryFn: async () => {
            const { data } = await axios.get("get-settings");
            return data;
        },
    });
    if (isLoading) {
        return <Loader />;
    }
    const onSubmit = async (data) => {
        const { siteName, siteLogo } = data;
        const imageFile = { image: siteLogo[0] };
        const loadingToast = toast.loading("Updating Settings ... ");
        const res = await uploader({ imageFile });
        if (res.success == true) {
            try {
                const uploadedImageUrl = res.data.display_url;
                await axiosSecure.put('/update-settings', {siteName,siteLogo:uploadedImageUrl})
                toast.dismiss(loadingToast);
                toast.success("Successfully Updated!");
            } catch (error) {
                if (error.code === "auth/requires-recent-login") {
                    toast.dismiss(loadingToast);
                    return toast.success("Successfully Updated!");
                }
                toast.dismiss(loadingToast);
                toast.error(error.code);
            }
        }
    };
    return (
        <div>
            <Helmet>
                <title>Dashboard | Settings</title>
            </Helmet>
            <div className="bg-white rounded-lg shadow-xl px-5 py-10 mx-auto lg:w-1/2">
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Site Name
                        </label>
                        <input
                            id="siteName"
                            type="text"
                            {...register("siteName", {
                                required: "Site Name is required.",
                            })}
                            placeholder="Enter Website Name"
                            className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                            defaultValue={settings?.siteName}
                        />
                        {errors.siteName && (
                            <span className="text-center text-red-500 flex items-center gap-1">
                                <BiErrorCircle className="inline-block ml-2" size={15} />
                                {errors.siteName?.message}
                            </span>
                        )}
                    </div>
                    <div>
                        <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                            Site logo
                        </label>
                        <span className="text-sm text-gray-500">Image Size Will Be 350x80</span>
                        <input
                            type="file"
                            {...register("siteLogo", {
                                required: "Logo is required.",
                                validate: (value) => {
                                    const acceptFormat = ["png"];
                                    const fileExtension = value[0]?.name
                                        .split(".")
                                        .pop()
                                        .toLowerCase();
                                    if (!acceptFormat.includes(fileExtension)) {
                                        return "Invalid Image. We Accept .png only.";
                                    }
                                    return true;
                                },
                            })}
                            accept="image/png, image/jpeg"
                            className="w-full block border bg-white placeholder-gray-500 leading-5 rounded-lg border-gray-200 focus:border-blue-500 px-2"
                        />
                        {errors.siteLogo && (
                            <span className="text-center text-red-500 flex items-center gap-1">
                                <BiErrorCircle className="inline-block ml-2" size={15} />
                                {errors.siteLogo?.message}
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary/95 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary/90 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary/90"
                    >
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
