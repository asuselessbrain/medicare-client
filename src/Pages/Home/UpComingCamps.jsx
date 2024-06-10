import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import SectionTitle from "../../components/SectionTitle";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import CampDetailsCard from "../Shared/CampDetailsCard";

const UpComingCamps = () => {
    const axios = useAxiosPublic();
    const { data: upcomingCamps = [], isLoading } = useQuery({
        queryKey: ["upcomingCamps"],
        queryFn: async () => {
            const { data } = await axios.get(`/upcoming-camps`);
            return data;
        },
    });
    if (isLoading) {
        return <Loader />;
    }
    return (
        <section className="text-gray-600 body-font py-5">
            <SectionTitle
                heading={"Upcoming Camps"}
                subHeading={"Discover the upcoming camps for Community Wellness"}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
                {upcomingCamps.slice(0, 3).map((camp) => (
                    <CampDetailsCard key={camp._id} camp={camp} />
                ))}
            </div>
        </section>
    );
};

export default UpComingCamps;
