import toast from "react-hot-toast";
import {
    HiCollection,
    HiOutlineCash,
    HiOutlineChatAlt,
    HiOutlineCog,
    HiOutlineCube,
    HiOutlineLogout,
    HiOutlineTemplate,
    HiOutlineUsers,
    HiOutlineViewGridAdd
} from "react-icons/hi";
import { NavLink } from "react-router-dom";
import useAdmin from "../../hooks/useAdmin";
import useAuth from "../../hooks/useAuth";
import useOrganizer from "../../hooks/useOrganizer";
import useProfessional from "../../hooks/useProfessional";

const Sidebar = ({ sidebarCollapse }) => {
    const { user, logOut } = useAuth();
    const [admin] = useAdmin();
    const [professional] = useProfessional();
    const [organizer] = useOrganizer();

    const logOutHandle = () => {
        logOut().then(() => {
            toast.success("Logout Successfully!");
        });
    };
    return (
        <div
            className={`bg-slate-900 px-3 flex flex-col h-full z-50 absolute md:static ${
                sidebarCollapse ? "" : "hidden md:flex"
            } w-60`}
        >
            <div className="py-5 flex flex-1 flex-col gap-0.5">
                {user && !organizer && !professional && !admin && (
                    <div>
                        <NavLink
                            to="participant-home"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center gap-2 hover:no-underline bg-[#1E293B] rounded-sm text-white py-2 px-1.5"
                                    : "flex items-center gap-2 hover:no-underline text-neutral-400 py-2 px-1.5 "
                            }
                        >
                            <HiOutlineViewGridAdd className="inline" size={20} />
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="registered-camps"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center gap-2 hover:no-underline bg-[#1E293B] rounded-sm text-white py-2 px-1.5"
                                    : "flex items-center gap-2 hover:no-underline text-neutral-400 py-2 px-1.5 "
                            }
                        >
                            <HiOutlineTemplate className="inline" size={20} />
                            Registered Camps
                        </NavLink>
                        <NavLink
                            to="payment-history"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center gap-2 hover:no-underline bg-[#1E293B] rounded-sm text-white py-2 px-1.5"
                                    : "flex items-center gap-2 hover:no-underline text-neutral-400 py-2 px-1.5 "
                            }
                        >
                            <HiOutlineCash className="inline" size={20} />
                            Payment History
                        </NavLink>
                        <NavLink
                            to="feedback-and-ratings"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center gap-2 hover:no-underline bg-[#1E293B] rounded-sm text-white py-2 px-1.5"
                                    : "flex items-center gap-2 hover:no-underline text-neutral-400 py-2 px-1.5 "
                            }
                        >
                            <HiOutlineChatAlt className="inline" size={20} />
                            Feedback and Ratings
                        </NavLink>
                    </div>
                )}
                {user && organizer && (
                    <>
                        <NavLink
                            to="organizer-home"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center gap-2 hover:no-underline bg-[#1E293B] rounded-sm text-white py-2 px-1.5"
                                    : "flex items-center gap-2 hover:no-underline text-neutral-400 py-2 px-1.5 "
                            }
                        >
                            <HiOutlineViewGridAdd className="inline" size={20} />
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="add-a-camp"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center gap-2 hover:no-underline bg-[#1E293B] rounded-sm text-white py-2 px-1.5"
                                    : "flex items-center gap-2 hover:no-underline text-neutral-400 py-2 px-1.5 "
                            }
                        >
                            <HiOutlineCube className="inline" size={20} />
                            Add Camp
                        </NavLink>
                        <NavLink
                            to="manage-camps"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center gap-2 bg-[#1E293B] hover:no-underline rounded-sm text-white py-2 px-1.5"
                                    : "flex items-center gap-2 hover:no-underline text-neutral-400 py-2 px-1.5 "
                            }
                        >
                            <HiCollection className="inline" size={20} />
                            Manage Camps
                        </NavLink>
                        <NavLink
                            to="manage-registered-camps"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center gap-2 bg-[#1E293B] hover:no-underline rounded-sm text-white py-2 px-1.5"
                                    : "flex items-center gap-2 hover:no-underline text-neutral-400 py-2 px-1.5 "
                            }
                        >
                            <HiCollection className="inline" size={20} />
                            Registered Camps
                        </NavLink>
                        <NavLink
                            to="add-upcoming-camp"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center gap-2 bg-[#1E293B] hover:no-underline rounded-sm text-white py-2 px-1.5"
                                    : "flex items-center gap-2 hover:no-underline text-neutral-400 py-2 px-1.5 "
                            }
                        >
                            <HiOutlineCube className="inline" size={20} />
                            Add Upcoming
                        </NavLink>
                        <NavLink
                            to="manage-upcoming-camps"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center gap-2 bg-[#1E293B] hover:no-underline rounded-sm text-white py-2 px-1.5"
                                    : "flex items-center gap-2 hover:no-underline text-neutral-400 py-2 px-1.5 "
                            }
                        >
                            <HiCollection className="inline" size={20} />
                            Manage Up Coming
                        </NavLink>
                        <NavLink
                            to="manage-requested-camps"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center gap-2 bg-[#1E293B] hover:no-underline rounded-sm text-white py-2 px-1.5"
                                    : "flex items-center gap-2 hover:no-underline text-neutral-400 py-2 px-1.5 "
                            }
                        >
                            <HiCollection className="inline" size={20} />
                            Upcoming Camp Review
                        </NavLink>
                    </>
                )}
                {user && admin && (
                    <div>
                        <NavLink
                            to="admin-home"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center gap-2 hover:no-underline bg-[#1E293B] rounded-sm text-white py-2 px-1.5"
                                    : "flex items-center gap-2 hover:no-underline text-neutral-400 py-2 px-1.5 "
                            }
                        >
                            <HiOutlineViewGridAdd className="inline" size={20} />
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="users"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center gap-2 hover:no-underline bg-[#1E293B] rounded-sm text-white py-2 px-1.5"
                                    : "flex items-center gap-2 hover:no-underline text-neutral-400 py-2 px-1.5 "
                            }
                        >
                            <HiOutlineUsers className="inline" size={20} />
                            Users
                        </NavLink>
                        <NavLink
                            to="settings"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center gap-2 hover:no-underline bg-[#1E293B] rounded-sm text-white py-2 px-1.5"
                                    : "flex items-center gap-2 hover:no-underline text-neutral-400 py-2 px-1.5 "
                            }
                        >
                            <HiOutlineCog className="inline" size={20} />
                            Settings
                        </NavLink>
                    </div>
                )}
                {user && professional && (
                    <div>
                        <NavLink
                            to="professional-home"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center gap-2 hover:no-underline bg-[#1E293B] rounded-sm text-white py-2 px-1.5"
                                    : "flex items-center gap-2 hover:no-underline text-neutral-400 py-2 px-1.5 "
                            }
                        >
                            <HiOutlineViewGridAdd className="inline" size={20} />
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="accepted-camps"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center gap-2 hover:no-underline bg-[#1E293B] rounded-sm text-white py-2 px-1.5"
                                    : "flex items-center gap-2 hover:no-underline text-neutral-400 py-2 px-1.5 "
                            }
                        >
                            <HiOutlineCog className="inline" size={20} />
                            Accepted Camps
                        </NavLink>
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-0.5 pt-2 border-t border-slate-700">
                {user && !organizer && !professional && !admin && (
                    <NavLink
                        to="participant-profile"
                        className={({ isActive }) =>
                            isActive
                                ? "flex items-center gap-2 hover:no-underline bg-[#1E293B] rounded-sm text-white py-2 px-1.5"
                                : "flex items-center gap-2 hover:no-underline text-neutral-400 py-2 px-1.5 "
                        }
                    >
                        <HiOutlineCog className="inline" size={20} />
                        Profile
                    </NavLink>
                )}
                {user && organizer && (
                    <NavLink
                        to="organizer-profile"
                        className={({ isActive }) =>
                            isActive
                                ? "flex items-center gap-2 hover:no-underline bg-[#1E293B] rounded-sm text-white py-2 px-1.5"
                                : "flex items-center gap-2 hover:no-underline text-neutral-400 py-2 px-1.5 "
                        }
                    >
                        <HiOutlineCog className="inline" size={20} />
                        Profile
                    </NavLink>
                )}
                {user && professional && (
                    <NavLink
                        to="professional-profile"
                        className={({ isActive }) =>
                            isActive
                                ? "flex items-center gap-2 hover:no-underline bg-[#1E293B] rounded-sm text-white py-2 px-1.5"
                                : "flex items-center gap-2 hover:no-underline text-neutral-400 py-2 px-1.5 "
                        }
                    >
                        <HiOutlineCog className="inline" size={20} />
                        Profile
                    </NavLink>
                )}
                {user && admin && (
                    <NavLink
                        to="admin-profile"
                        className={({ isActive }) =>
                            isActive
                                ? "flex items-center gap-2 hover:no-underline bg-[#1E293B] rounded-sm text-white py-2 px-1.5"
                                : "flex items-center gap-2 hover:no-underline text-neutral-400 py-2 px-1.5 "
                        }
                    >
                        <HiOutlineCog className="inline" size={20} />
                        Profile
                    </NavLink>
                )}
                <div onClick={logOutHandle} className="cursor-pointer text-red-500 pb-2 px-1.5">
                    <span className="text-xl mr-2">
                        <HiOutlineLogout className="inline" size={20} />
                    </span>
                    Logout
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
