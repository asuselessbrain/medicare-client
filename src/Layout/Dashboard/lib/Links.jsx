import {
    HiOutlineAnnotation,
    HiOutlineCog,
    HiOutlineCube,
    HiOutlineDocumentText,
    HiOutlineQuestionMarkCircle,
    HiOutlineShoppingCart,
    HiOutlineUsers,
    HiOutlineViewGrid,
} from "react-icons/hi";

export const DASHBOARD_SIDEBAR_LINKS = [
    {
        key: "dashboard",
        label: "Dashboard",
        path: "/",
        icon: <HiOutlineViewGrid className="inline" size={20}/>,
    },
    {
        key: "products",
        label: "Products",
        path: "/products",
        icon: <HiOutlineCube className="inline" size={20}/>,
    },
    {
        key: "orders",
        label: "Orders",
        path: "/orders",
        icon: <HiOutlineShoppingCart className="inline" size={20}/>,
    },
    {
        key: "customers",
        label: "Customers",
        path: "/customers",
        icon: <HiOutlineUsers className="inline" size={20}/>,
    },
    {
        key: "transactions",
        label: "Transactions",
        path: "/transactions",
        icon: <HiOutlineDocumentText className="inline" size={20}/>,
    },
    {
        key: "messages",
        label: "Messages",
        path: "/messages",
        icon: <HiOutlineAnnotation className="inline" size={20}/>,
    },
];

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
    {
        key: "settings",
        label: "Settings",
        path: "/settings",
        icon: <HiOutlineCog className="inline" size={20}/>,
    },
    {
        key: "support",
        label: "Help & Support",
        path: "/support",
        icon: <HiOutlineQuestionMarkCircle className="inline" size={20}/>,
    },
];
