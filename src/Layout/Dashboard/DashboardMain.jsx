import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashboardMain = () => {
    const [sidebarCollapse, setSidebarCollapse] = useState(false);
    return (
        <div className="bg-slate-100 h-screen w-screen overflow-hidden flex flex-col">
            <Helmet>
                <title>MediCare | Dashboard</title>
            </Helmet>
            <Navbar sidebarCollapse={sidebarCollapse} setSidebarCollapse={setSidebarCollapse} />
            <div className="flex flex-1 overflow-auto">
                <Sidebar sidebarCollapse={sidebarCollapse} />
                <div className="flex-1 p-4 min-h-0 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardMain;
