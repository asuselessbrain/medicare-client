import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import SectionTitle from "../../components/SectionTitle";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Review from "./Review";

// import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
// import { Navigation } from "swiper/modules";

const Testimonials = () => {
  const axios = useAxiosPublic();
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data } = await axios.get(`/reviews`);
      return data;
    },
  });
  if (isLoading) {
    return <Loader />;
  }
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <SectionTitle
          heading={"Testimonials"}
          subHeading={"What Our Participants Say"}
        />
        <div className="flex flex-wrap -m-4 py-5">
          {reviews.slice(0, 2).map((review) => (
            <Review review={review} key={review._id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
