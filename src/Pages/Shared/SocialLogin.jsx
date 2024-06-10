import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const SocialLogin = () => {
    const { googleLogin } = useAuth();
    const axios = useAxiosPublic();
    const location = useLocation();
    const navigate = useNavigate();
    let from = location?.state?.from?.pathname || "/";
    const handleGoogleLogin = async () => {
        toast.loading("User Login In ... ");
        try {
            const { user } = await googleLogin();
            console.log(user);
            if (user?.email) {
                const newUser = {
                    name: user.displayName,
                    email: user?.email,
                    createdAt: user?.metadata?.creationTime,
                    lastSignInTime: user?.metadata?.lastSignInTime,
                };
                await axios.post("/add-user", newUser);
                toast.dismiss();
                toast.success("User Success ... ");
                navigate(from, { replace: true });
            }
        } catch (error) {
            console.log(error.code);
        }
    };
    return (
        <div className="mt-4 flex flex-col lg:flex-row items-center justify-between">
            <div className="w-full mb-2 lg:mb-0">
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
                >
                    <FcGoogle size={20} />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default SocialLogin;
