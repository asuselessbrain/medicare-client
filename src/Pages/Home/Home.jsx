import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Container from "../../components/Container";
import FAQ from "./Faq";
import PopularCamps from "./PopularCamps";
import Slider from "./Slider";
import Testimonials from "./Testimonials";
import UpComingCamps from "./UpComingCamps";

const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <>
            <Helmet>
                <title>MediCare | Home</title>
            </Helmet>
            <Container>
                <Slider />
                <PopularCamps />
                <UpComingCamps />
                <Testimonials />
                <FAQ />
            </Container>
        </>
    );
};

export default Home;
