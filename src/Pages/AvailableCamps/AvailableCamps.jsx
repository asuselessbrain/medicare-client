import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Container from "../../components/Container";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import CampCard from "../Shared/CampCard";

const AvailableCamps = () => {
    const [sort, setSort] = useState("dsc");
    const { user } = useAuth();
    const axios = useAxios();
    const [searchValue, setSearchValue] = useState("");
    const searchHandle = (e) => {
        console.log(searchValue);
        e.preventDefault();
        const value = e.target.search.value;
        if (value) {
            setSearchValue(value);
        } else {
            setSearchValue("");
        }
    };
    const { data: availableCamps = [] } = useQuery({
        queryKey: ["availableCamps", searchValue, sort],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axios.get(`/available-camps?search=${searchValue}&sort=${sort}`);
            return res.data;
        },
    });
    const sortBy = (val) => {
        setSort(val);
    };
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div>
            <Helmet>
                <title>Medicare | Available Camps</title>
            </Helmet>
            <Container>
                <div className="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 rounded-xl py-5 my-5 mx-3">
                    <div className="mx-auto md:w-1/2 px-3 py-10">
                        <div className="relative ">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <form onSubmit={searchHandle}>
                                <input
                                    type="search"
                                    id="search"
                                    name="search"
                                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                    placeholder="Search Camps..."
                                    required=""
                                />
                                <button
                                    type="submit"
                                    className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="px-5 py-8 mx-auto">
                    <div className="flex justify-end items-center gap-2 pb-2">
                        <select
                            name="sort"
                            id="sort"
                            onChange={(e) => sortBy(e.target.value)}
                            className="border border-primary/20 text-sm px-2.5 py-1 rounded-md focus:border-primary/20 outline-none transition-colors duration-300"
                        >
                            <option value="">Sort By</option>
                            <option value="camp">Camp Name (A-Z)</option>
                            <option value="audience">Target Audience</option>
                            <option value="register">Most Registered</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 -m-4 ">
                        {availableCamps.map((camp) => (
                            <CampCard key={camp._id} camp={camp} joinCamp />
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default AvailableCamps;
