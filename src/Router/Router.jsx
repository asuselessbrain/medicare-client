import axios from "axios";
import { createBrowserRouter } from "react-router-dom";
import DashboardMain from "../Layout/Dashboard/DashboardMain";
import Main from "../Layout/Main/Main";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import AvailableCamps from "../Pages/AvailableCamps/AvailableCamps";
import CampDetails from "../Pages/CampDetails/CampDetails";
import UpComingCampDetails from "../Pages/CampDetails/UpComingCampDetails";
import Contact from "../Pages/Contact/Contact";
import AdminHome from "../Pages/Dashboard/Admin/AdminHome";
import AdminProfile from "../Pages/Dashboard/Admin/AdminProfile";
import Settings from "../Pages/Dashboard/Admin/Settings";
import Users from "../Pages/Dashboard/Admin/Users";
import AcceptedCamps from "../Pages/Dashboard/HealthcareProfessionals/AcceptedCamps";
import HealthcareProfessionalsHome from "../Pages/Dashboard/HealthcareProfessionals/HealthcareProfessionalsHome";
import ProfessionalProfile from "../Pages/Dashboard/HealthcareProfessionals/ProfessionalProfile";
import AddCamp from "../Pages/Dashboard/Organizers/AddCamp";
import AddUpComingCamp from "../Pages/Dashboard/Organizers/AddUpComingCamp";
import ManageCamps from "../Pages/Dashboard/Organizers/ManageCamps";
import ManageRegisteredCamps from "../Pages/Dashboard/Organizers/ManageRegisteredCamps";
import ManageRequested from "../Pages/Dashboard/Organizers/ManageRequested";
import ManageUpComingCamp from "../Pages/Dashboard/Organizers/ManageUpComingCamp";
import OrganizerProfile from "../Pages/Dashboard/Organizers/OrganizerProfile";
import OrganizersHome from "../Pages/Dashboard/Organizers/OrganizersHome";
import FeedbackAndRatings from "../Pages/Dashboard/Perticipants/FeedbackAndRatings";
import ParticipantProfile from "../Pages/Dashboard/Perticipants/ParticipantProfile";
import Payment from "../Pages/Dashboard/Perticipants/Payment";
import PaymentHistory from "../Pages/Dashboard/Perticipants/PaymentHistory";
import PerticipantsHome from "../Pages/Dashboard/Perticipants/PerticipantsHome";
import RegisteredCamps from "../Pages/Dashboard/Perticipants/RegisteredCamps";
import Error401 from "../Pages/Error/Error401";
import Error404 from "../Pages/Error/Error404";
import Home from "../Pages/Home/Home";
import AdminRouter from "./AdminRouter";
import OrganizerRouter from "./OrganizerRouter";
import PrivateRouter from "./PrivateRouter";
import ProfessionalRouter from "./ProfessionalRouter";
const Router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        errorElement: <Error404 />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/contact-us",
                element: <Contact />,
            },
            {
                path: "/camp-details/:campId",
                loader: ({ params }) =>
                    axios.get(`https://medicare-server-umber.vercel.app/camp-details/${params.campId}`),
                element: <CampDetails />,
            },
            {
                path: "/upcoming-camp-details/:campId",
                loader: ({ params }) =>
                    axios.get(`https://medicare-server-umber.vercel.app/upcoming-camp-details/${params.campId}`),
                element: <UpComingCampDetails />,
            },
            {
                path: "/available-camps",
                element: (
                    <PrivateRouter>
                        <AvailableCamps />
                    </PrivateRouter>
                ),
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
        ],
    },
    {
        path: "/dashboard",
        element: (
            <PrivateRouter>
                <DashboardMain />
            </PrivateRouter>
        ),
        errorElement: <Error404 />,
        children: [
            {
                path: "participant-home",
                element: (
                    <PrivateRouter>
                        <PerticipantsHome />
                    </PrivateRouter>
                ),
            },
            {
                path: "organizer-home",
                element: (
                    <OrganizerRouter>
                        <OrganizersHome />
                    </OrganizerRouter>
                ),
            },
            {
                path: "admin-home",
                element: (
                    <AdminRouter>
                        <AdminHome />
                    </AdminRouter>
                ),
            },
            {
                path: "organizer-profile",
                element: (
                    <OrganizerRouter>
                        <OrganizerProfile />
                    </OrganizerRouter>
                ),
            },
            {
                path: "add-a-camp",
                element: (
                    <OrganizerRouter>
                        <AddCamp />
                    </OrganizerRouter>
                ),
            },
            {
                path: "manage-camps",
                element: (
                    <OrganizerRouter>
                        <ManageCamps />
                    </OrganizerRouter>
                ),
            },
            {
                path: "manage-registered-camps",
                element: (
                    <OrganizerRouter>
                        <ManageRegisteredCamps />
                    </OrganizerRouter>
                ),
            },
            {
                path: "manage-requested-camps",
                element: (
                    <OrganizerRouter>
                        <ManageRequested />
                    </OrganizerRouter>
                ),
            },
            {
                path: "add-upcoming-camp",
                element: (
                    <OrganizerRouter>
                        <AddUpComingCamp />
                    </OrganizerRouter>
                ),
            },
            {
                path: "manage-upcoming-camps",
                element: (
                    <OrganizerRouter>
                        <ManageUpComingCamp />
                    </OrganizerRouter>
                ),
            },
            {
                path: "participant-profile",
                element: (
                    <PrivateRouter>
                        <ParticipantProfile />
                    </PrivateRouter>
                ),
            },
            {
                path: "registered-camps",
                element: (
                    <PrivateRouter>
                        <RegisteredCamps />
                    </PrivateRouter>
                ),
            },
            {
                path: "payment",
                element: (
                    <PrivateRouter>
                        <Payment />
                    </PrivateRouter>
                ),
            },
            {
                path: "payment-history",
                element: (
                    <PrivateRouter>
                        <PaymentHistory />
                    </PrivateRouter>
                ),
            },
            {
                path: "feedback-and-ratings",
                element: (
                    <PrivateRouter>
                        <FeedbackAndRatings />
                    </PrivateRouter>
                ),
            },
            {
                path: "professional-home",
                element: (
                    <ProfessionalRouter>
                        <HealthcareProfessionalsHome />
                    </ProfessionalRouter>
                ),
            },
            {
                path: "professional-profile",
                element: (
                    <ProfessionalRouter>
                        <ProfessionalProfile />
                    </ProfessionalRouter>
                ),
            },
            {
                path: "accepted-camps",
                element: (
                    <ProfessionalRouter>
                        <AcceptedCamps />
                    </ProfessionalRouter>
                ),
            },
            {
                path: "admin-profile",
                element: (
                    <AdminRouter>
                        <AdminProfile />
                    </AdminRouter>
                ),
            },
            {
                path: "users",
                element: (
                    <AdminRouter>
                        <Users />
                    </AdminRouter>
                ),
            },
            {
                path: "settings",
                element: (
                    <AdminRouter>
                        <Settings />
                    </AdminRouter>
                ),
            },
        ],
    },
    {
        path: "/unAuthorize-Access",
        element: <Error401 />,
    },
]);

export default Router;
