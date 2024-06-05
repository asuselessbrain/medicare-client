import { Helmet } from "react-helmet-async";

const OrganizersHome = () => {
    return (
        <div>
            <Helmet>
                <title>Dashboard | Organizers Home</title>
            </Helmet>
            <div className="flex bg-white shadow rounded-xl justify-center items-center text-3xl py-5">
                Welcome To Dashboard
            </div>
        </div>
    );
};

export default OrganizersHome;
