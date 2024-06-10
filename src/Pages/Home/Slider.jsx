import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
// import "swiper/css/navigation";

// import required modules
import { Autoplay, Navigation } from 'swiper/modules';

const Slider = () => {
    const slides = [
        {
            url: "https://i.ibb.co/WyZ1Cbz/slider1.jpg",
        },
        {
            url: "https://i.ibb.co/6XpWXRb/slider2.jpg",
        },
        {
            url: "https://i.ibb.co/GFdxJtV/slider3.jpg",
        },
        {
            url: "https://i.ibb.co/PQLkRh9/slider4.jpg",
        },
        {
            url: "https://i.ibb.co/3S2BTQD/slider5.jpg",
        },
    ];
    return (
        <div className="px-3 py-8">
            <Swiper
                style={{
                    "--swiper-navigation-color": "#fff",
                    "--swiper-pagination-color": "#fff",
                }}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                navigation={true}
                modules={[Autoplay, Navigation]}
                className="mySwiper rounded-xl max-h-[680px]"
            >
                {slides.map((img) => (
                    <SwiperSlide key={img.url}>
                        <img className="object-cover object-center w-full" src={img.url} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Slider;
