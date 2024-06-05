import { Helmet } from "react-helmet-async";

const AdminHome = () => {
    return (
        <div className="flex bg-white shadow rounded-xl justify-center items-center text-3xl py-5">
            <Helmet>
                <title>Dashboard | Admin Home</title>
            </Helmet>
            Welcome To Dashboard
        </div>
    );
};

export default AdminHome;
