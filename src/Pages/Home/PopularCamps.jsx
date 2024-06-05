import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import SectionTitle from "../../components/SectionTitle";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import CampCard from "../Shared/CampCard";

const PopularCamps = () => {
    const axios = useAxiosPublic();
    const [sort, setSort] = useState("dsc");
    const { data: popularCamps = [], isLoading } = useQuery({
        queryKey: ["popularCamps", sort],
        queryFn: async () => {
            const { data } = await axios.get(`/popular-camps?sort=${sort}`);
            return data;
        },
    });
    if (isLoading) {
        return <Loader />;
    }
    const sortBy = (val) => {
        setSort(val);
    };
    return (
        <section className="text-gray-600 body-font py-5">
            <SectionTitle
                heading={"Popular Camps"}
                subHeading={"Explore Events Aimed at Community Wellness"}
            />
            <div className="py-8 mx-auto">
                <div className="flex justify-end items-center gap-2 pb-2">
                    <select
                        name="sort"
                        id="sort"
                        onChange={(e) => sortBy(e.target.value)}
                        className="border border-primary/20 text-sm px-2.5 py-1 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                    >
                        <option value="">Sort By</option>
                        <option value="asc">Participant Count</option>
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
                    {popularCamps.slice(0, 6).map((camp) => (
                        <CampCard key={camp._id} camp={camp} />
                    ))}
                </div>
            </div>
            <div className="flex justify-center items-center py-1">
                <Link
                    to="/available-camps"
                    className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary/95 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary/90 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary/90"
                >
                    See All Camps
                </Link>
            </div>
        </section>
    );
};

export default PopularCamps;
