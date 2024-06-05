import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import logo from '../../assets/logo.png'
import { FiAlignJustify, FiLogOut, FiUser } from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";
import useAdmin from "../../hooks/useAdmin";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useOrganizer from "../../hooks/useOrganizer";
import useProfessional from "../../hooks/useProfessional";
const Header = () => {
    const axios = useAxiosPublic();
    const { data: homeSettings = {} } = useQuery({
        queryKey: ["homeSettings"],
        queryFn: async () => {
            const { data } = await axios.get("get-settings");
            return data;
        },
    });
    const [dropdownOpen, setDropDown] = useState(false);
    const [collapse, setCollapse] = useState(false);
    const imgRef = useRef();
    const dropdownRef = useRef();
    const { user = {}, logOut } = useAuth();
    window.addEventListener("click", (e) => {
        if (e.target !== dropdownRef.current && e.target !== imgRef.current) {
            setDropDown(false);
        }
    });
    const handleDropDown = () => {
        setDropDown(!dropdownOpen);
    };
    const logOutHandle = () => {
        logOut().then(() => {
            toast.success("Logout Successfully!");
        });
    };
    const [admin] = useAdmin();
    const [professional] = useProfessional();
    const [organizer] = useOrganizer();
    return (
        <>
            <Helmet>
                <title>{homeSettings.siteName}</title>
            </Helmet>
            <nav className="flex-no-wrap relative flex w-full items-center justify-between bg-[#FBFBFB] py-2.5 shadow-md shadow-black/5  md:flex-wrap lg:py-3.5 px-3">
                <div className="flex w-full items-center justify-between md:max-w-screen-xl mx-auto">
                    <button
                        onClick={() => setCollapse(!collapse)}
                        className="block border-0 bg-transparent px-2 text-neutral-500 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0  lg:hidden"
                        type="button"
                    >
                        <FiAlignJustify size={25} />
                    </button>
                    {/* Collapsible navigation container */}
                    <div className="flex justify-center items-center">
                        {/* Logo */}
                        <Link
                            className="flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900  lg:mb-0 lg:mt-0"
                            to='/'
                        >
                            <img
                                src={logo}
                                className="w-16 md:w-24"
                                alt="MediCare Logo"
                            />
                        </Link>
                    </div>
                    <div
                        className={`!visible ${
                            collapse ? "block" : "hidden"
                        } absolute md:static top-14 bg-white w-full md:w-auto border shadow-xl md:border-none md:shadow-none items-center px-3 lg:!flex lg:basis-auto z-50`}
                    >
                        {/* Left navigation links */}
                        <ul className="flex mx-auto flex-col pl-0 md:flex-row justify-center gap-5 py-3">
                            <NavLink to="/" className="navLink">
                                Home
                            </NavLink>
                            <NavLink to="/contact-us" className="navLink">
                                Contact Us
                            </NavLink>
                            {user && (
                                <NavLink to="/available-camps" className="navLink">
                                    Available Camps
                                </NavLink>
                            )}
                            {user && !organizer&& !professional&& !admin&&(
                                <NavLink to="/dashboard/participant-home" className="navLink">
                                    Dashboard
                                </NavLink>
                            )}
                            {user && organizer && (
                                <NavLink to="/dashboard/organizer-home" className="navLink">
                                    Dashboard
                                </NavLink>
                            )}
                            {user && professional && (
                                <NavLink to="/dashboard/professional-home" className="navLink">
                                    Dashboard
                                </NavLink>
                            )}
                            {user && admin && (
                                <NavLink to="/dashboard/admin-home" className="navLink">
                                    Dashboard
                                </NavLink>
                            )}
                        </ul>
                    </div>
                    {/* Right elements */}
                    {user ? (
                        <div className="relative flex items-center">
                            {/* Second dropdown container */}
                            <div className="relative">
                                <img
                                    ref={imgRef}
                                    onClick={handleDropDown}
                                    src={user?.photoURL}
                                    className="rounded-full w-10 h-10 cursor-pointer"
                                />
                                <ul
                                    ref={dropdownRef}
                                    className={`absolute py-2 px-1 z-[1000] m-0  min-w-max overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg  w-40 ${
                                        dropdownOpen ? "block left-auto right-0" : "hidden"
                                    }`}
                                >
                                {user && !organizer && !professional && !admin && (
                                    <li>
                                        <Link
                                            to="/dashboard/participant-profile"
                                            className="rounded w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent 
                                        flex items-center gap-2
                                        "
                                        >
                                            <FiUser className="inline-block" size={15} />
                                            Profile
                                        </Link>
                                    </li>
                                )}
                                {user && organizer && (
                                    <li>
                                        <Link
                                            to="/dashboard/organizer-profile"
                                            className="rounded w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent 
                                            flex items-center gap-2
                                            "
                                        >
                                            <FiUser className="inline-block" size={15} />
                                            Profile
                                        </Link>
                                    </li>
                                )}
                                {user && professional && (
                                    <li>
                                        <Link
                                            to="/dashboard/professional-profile"
                                            className="rounded w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent 
                                            flex items-center gap-2
                                            "
                                        >
                                            <FiUser className="inline-block" size={15} />
                                            Profile
                                        </Link>
                                    </li>
                                )}
                                {user && admin && (
                                    <li>
                                        <Link
                                            to="/dashboard/admin-profile"
                                            className="rounded w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent 
                                            flex items-center gap-2
                                            "
                                        >
                                            <FiUser className="inline-block" size={15} />
                                            Profile
                                        </Link>
                                    </li>
                                )}
                                    <li>
                                        <button
                                            onClick={logOutHandle}
                                            className="rounded w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent
                                        flex items-center gap-2
                                        "
                                        >
                                            <FiLogOut />
                                            LogOut
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {/* <Link
                                to="/login"
                                type="button"
                                className="inline-block rounded bg-primary/10 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary/90 transition duration-150 ease-in-out hover:bg-primary/20 focus:bg-primary/30 focus:outline-none focus:ring-0 active:bg-primary/20"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                type="button"
                                className="mr-3 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary/95 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary/90 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary/90"
                            >
                                Sign Up
                            </Link> */}

<Link
                                to="/login"
                                type="button"
                                className="inline-block rounded bg-primary/10 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary/90 transition duration-150 ease-in-out hover:bg-primary/20 focus:bg-primary/30 focus:outline-none focus:ring-0 active:bg-primary/20"
                            >
                                Join Us
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Header;
