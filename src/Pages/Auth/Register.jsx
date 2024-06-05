import Lottie from "lottie-react";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BiErrorCircle } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import uploader from "../../Utils/uploader";
import registerAnimation from "../../assets/animation/Animation - 1717262547605.json";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import SocialLogin from "../Shared/SocialLogin";

const Register = () => {
    const { createRegister, setLoading, logOut, userUpdate } = useAuth();

    const axios = useAxiosPublic();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const { name, role, image, email, password } = data;
        console.log(data);
        const imageFile = { image: image[0] };
        const loadingToast = toast.loading("User Creating ... ");
        const res = await uploader({imageFile})

        if (res.success == true) {
            const uploadedImageUrl = res.data.display_url;
            try {
                const userResult = await createRegister(email, password);
                const user = userResult.user;
                const newUser = {
                    name: name,
                    email: user.email,
                    role: role,
                    createdAt: user.metadata?.creationTime,
                    lastSignInTime: user.metadata?.lastSignInTime,
                };
                console.log(newUser);
                if (userResult.user?.email) {
                    try {
                        await axios.post("/add-user", newUser);
                        await userUpdate(name, uploadedImageUrl);
                        toast.dismiss(loadingToast);
                        toast.success("Successfully created!");
                        await logOut();
                        navigate("/login");
                    } catch (error) {
                        setLoading(false);
                        console.log("Error image", error);
                    }
                }
            } catch (error) {
                if ("auth/email-already-in-use" === error.code) {
                    toast.dismiss(loadingToast);
                    return toast.error("Email Already Used!");
                }
                setLoading(false);
                toast.dismiss(loadingToast);
                toast.error(error.code);
            }
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <>
            <div className="flex">
                <Helmet>
                    <title>MediCare | Register</title>
                </Helmet>
                {/* Left Pane */}
                <div className="hidden lg:flex items-center justify-center flex-1 py-5">
                    <div className="max-w-md text-center">
                        <Lottie animationData={registerAnimation} loop={true} />
                    </div>
                </div>
                {/* Right Pane */}
                <div className="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center py-5">
                    <div className="max-w-md w-full p-6">
                        <h1 className="text-3xl font-semibold mb-6 text-black text-center">
                            Register
                        </h1>
                        <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
                            Sign Up to Our Medical Camp Service
                        </h1>
                        <SocialLogin />
                        <div className="mt-4 text-sm text-gray-600 text-center">
                            <p>or with email</p>
                        </div>
                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    {...register("name", {
                                        required: "Name is required.",
                                        minLength: {
                                            value: 5,
                                            message: "Name should be at least 5 characters.",
                                        },
                                        maxLength: {
                                            value: 15,
                                            message: "Name should not exceed 15 characters.",
                                        },
                                    })}
                                    className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                />
                                {errors.name && (
                                    <span className="text-center text-red-500 flex items-center gap-1">
                                        <BiErrorCircle className="inline-block ml-2" size={15} />
                                        {errors.name?.message}
                                    </span>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="role"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Select Your Role
                                </label>
                                <select
                                    id="role"
                                    {...register("role", {
                                        required: "Role is required.",
                                    })}
                                    className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                    defaultValue={"participant"}
                                >
                                    <option value="organizer">Organizer</option>
                                    <option value="healthcare_professional">
                                        Healthcare Professional
                                    </option>
                                    <option value="participant">Participant</option>
                                </select>
                                {errors.role && (
                                    <span className="text-center text-red-500 flex items-center gap-1">
                                        <BiErrorCircle className="inline-block ml-2" size={15} />{" "}
                                        {errors.role?.message}
                                    </span>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="image"
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
                                        <BiErrorCircle className="inline-block ml-2" size={15} />{" "}
                                        {errors.image?.message}
                                    </span>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    {...register("email", {
                                        required: "Email is required.",
                                        pattern: {
                                            value: /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                            message: "Invalid email format.",
                                        },
                                    })}
                                    className="mt-1 p-2 w-full border border-primary/20 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                                    autoComplete="username"
                                />
                                {errors.email && (
                                    <span className="text-center text-red-500 flex items-center gap-1">
                                        <BiErrorCircle className="inline-block ml-2" size={15} />{" "}
                                        {errors.email?.message}
                                    </span>
                                )}
                            </div>
                            <div>
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
                                            message: "Password must be at least 6 characters long.",
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
                                        <BiErrorCircle className="inline-block ml-2" size={15} />
                                        {errors.password?.message}
                                    </span>
                                )}
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full btn-primary"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </form>
                        <div className="mt-4 text-sm text-gray-600 text-center">
                            <p>
                                Already have an account?{" "}
                                <Link to="/login" className="text-black text-md hover:underline">
                                    Log In Here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
