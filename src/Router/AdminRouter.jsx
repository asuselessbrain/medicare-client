import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";
import useAdmin from "../hooks/useAdmin";
import useAuth from "../hooks/useAuth";

const AdminRouter = ({ children }) => {
    const { user, loading } = useAuth();
    const [admin, isAdminPending] = useAdmin();

    if (loading || isAdminPending) {
        return <Loader />;
    }
    if (user && admin) {
        return children;
    }
    return <Navigate to="/unAuthorize-Access" replace/>;
};

export default AdminRouter;
