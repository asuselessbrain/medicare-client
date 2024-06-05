import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";
import useAuth from "../hooks/useAuth";
import useProfessional from "../hooks/useProfessional";

const ProfessionalRouter = ({ children }) => {
    const { user, loading } = useAuth();
    const [professional, isProfessionalPending] = useProfessional();

    if (loading || isProfessionalPending) {
        return <Loader />;
    }
    if (user && professional) {
        return children;
    }
    return <Navigate to="/unAuthorize-Access" replace />;
};

export default ProfessionalRouter;
