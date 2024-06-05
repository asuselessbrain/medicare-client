import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { CiHome } from "react-icons/ci";
import { FiAlignLeft, FiLogOut, FiUser, FiX } from "react-icons/fi";
import { HiOutlineSearch } from "react-icons/hi";
import { Link } from "react-router-dom";
import useAdmin from "../../hooks/useAdmin";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useOrganizer from "../../hooks/useOrganizer";
import useProfessional from "../../hooks/useProfessional";

const Navbar = ({ sidebarCollapse, setSidebarCollapse }) => {
    const axios = useAxiosPublic();
    const axiosSecure = useAxios();
    const [showSearch, setShowSearch] = useState(false)
    const [searchValue, setSearchValue] = useState("");
    const { data: dashboardSettings = {} } = useQuery({
        queryKey: ["dashboardSettings"],
        queryFn: async () => {
            const { data } = await axios.get("get-settings");
            return data;
        },
    });
    const [dropdownOpen, setDropDown] = useState(false);
    const imgRef = useRef();
    const searchRef = useRef();
    const dropdownRef = useRef();
    const { user, logOut } = useAuth();
    window.addEventListener("click", (e) => {
        if (e.target !== dropdownRef.current && e.target !== imgRef.current && e.target !== searchRef.current) {
            setDropDown(false);
            setShowSearch(false)
        }
    });
    const { data: dashboardSearch = [] } = useQuery({
        queryKey: ["dashboardSearch", searchValue],
        enabled: !!user?.email && showSearch,
        queryFn: async () => {
            const res = await axiosSecure.get(`/available-camps?search=${searchValue}`);
            return res.data;
        },
    });
    const handleDropDown = () => {
        setDropDown(!dropdownOpen);
    };
    const logOutHandle = () => {
        logOut().then(() => {
            toast.success("Logout Successfully!");
        });
    };
    const handleSearchBox = ()=>{
        setShowSearch(true)
    }
    const handleSidebarCollapse = () => {
        setSidebarCollapse(!sidebarCollapse);
    };
    const [admin] = useAdmin();
    const [professional] = useProfessional();
    const [organizer] = useOrganizer();
    return (
        <div className="flex">
            <Helmet>
                <title>{dashboardSettings.siteName}</title>
            </Helmet>
            <div className="flex md:justify-center items-center gap-2 bg-white md:bg-slate-900 h-16 w-60 px-3 md:px-0">
                <button onClick={handleSidebarCollapse} className="md:hidden">
                    <FiAlignLeft fill="#0F172A" size={25} />
                </button>
                <img className="w-32" src={dashboardSettings.siteLogo} alt="" />
            </div>
            <div className="bg-white h-16 px-4 flex items-center border-b flex-1 border-gray-200 justify-end md:justify-between">
                <div className="relative hidden md:block">
                    <HiOutlineSearch
                        fontSize={20}
                        className="text-gray-400 absolute top-1/2 left-3 -translate-y-1/2"
                    />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="text-sm focus:outline-none active:outline-none border border-gray-300 h-10 pl-11 pr-4 rounded-sm"
                        ref={searchRef}
                        onClick={handleSearchBox}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    {showSearch&&<button onClick={()=>setShowSearch(false)} className="absolute right-2 top-3"><FiX fill="gray" size={15}/></button>}
                    {showSearch && (
                        <div className="absolute bg-white w-full px-3 py-2 mt-1 border">
                            <ul className="flex flex-col justify-center gap-2">
                                {dashboardSearch.slice(0, 5).map((camp) => (
                                    <li key={camp._id}><Link to={`/camp-details/${camp._id}`}>{camp.campName}</Link></li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex justify-center items-center px-3 py-2">
                        <Link to="/" className="bg-gray-100 text-gray-600 rounded px-1.5 py-0.5">
                            <CiHome className="inline mr-2" />
                            Home
                        </Link>
                    </div>
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
                                            to="participant-profile"
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
                                            to="organizer-profile"
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
                                            to="professional-profile"
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
                                            to="admin-profile"
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
                </div>
            </div>
        </div>
    );
};

export default Navbar;
