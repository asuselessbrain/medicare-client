import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import CheckOutForm from "./CheckOutForm";

const Payment = () => {
    const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_KEY);
    const location = useLocation();
    const orderData = location.state;
    const appearance = {
        theme: "stripe",
        variables: {
            colorPrimary: "#0570de",
            colorBackground: "#ffffff",
            colorText: "#30313d",
            colorDanger: "#df1b41",
            fontFamily: "Ideal Sans, system-ui, sans-serif",
            spacingUnit: "2px",
            borderRadius: "4px",
        },
    };
    const options = {
        appearance,
    };
    return (
        <>
            <Helmet>
                <title>Dashboard | Payment</title>
            </Helmet>
            <Elements stripe={stripePromise} options={options}>
                <CheckOutForm invoiceData={orderData} />
            </Elements>
        </>
    );
};

export default Payment;
