import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";

const CheckOutForm = ({invoiceData}) => {
    const axios = useAxios()
    const stripe = useStripe();
    const elements = useElements();
    const {user} = useAuth()
    const navigate = useNavigate()
    const [name, setName] = useState(user.displayName);
    const [postalCode, setPostalCode] = useState(null);
    const [errorMassage, setErrorMassage] = useState(null);
    const [transactionId, setTransactionId] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        const card = elements.getElement(CardNumberElement);
        if (!card) {
            return;
        }
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card,
        });
        if (error) {
            setErrorMassage(error);
            console.log("payment error: ", error);
        } else {
            console.log("payment method: ", paymentMethod);
            setErrorMassage(null);
        }
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: name || "anonymous",
                        email: user.email || "anonymous",
                        address: {
                            postal_code: postalCode,
                        },
                    },
                },
            }
        );
        if (confirmError) {
            setErrorMassage(confirmError);
            console.log("payment error: ", confirmError);
        } else {
            console.log("payment intent: ", paymentIntent);
            setErrorMassage(null);
        }
        if (paymentIntent.status === "succeeded") {
            setTransactionId(paymentIntent.id);
        }
        e.target.reset();
        const payment = {
            campName: invoiceData.campName,
            Fees:invoiceData.fee,
            scheduledDate:invoiceData.scheduledDate,
            scheduledTime:invoiceData.scheduledTime,
            venueLocation:invoiceData.venueLocation,
            PaymentStatus:'confirmed',
            ConfirmationStatus:'confirmed',
            email:invoiceData.email,
            createdBy:invoiceData.createdBy,
        };
        await axios.put(`/update-registered-camp/${invoiceData._id}?paymentStatus=approved`)
        await axios.post("/create-payment", payment);
        Swal.fire({
            title: "Payment Success!",
            text: "Your payment successful.",
            icon: "success",
        });
        return navigate('/dashboard/payment-history')
    };
    useEffect(() => {
        if (invoiceData.fee>0) {
            axios
            .post("/create-payment-intent", { price: invoiceData.fee })
            .then(({ data }) => setClientSecret(data.clientSecret));
        }

    }, [axios, invoiceData.fee]);

    return (
        <div className="flex items-center justify-center px-5 pb-10 pt-16">
            <div
                className="w-full mx-auto rounded-lg bg-white shadow-lg p-5 text-gray-700 space-y-3"
                style={{ maxWidth: 600 }}
            >
                <form onSubmit={handleSubmit}>
                    <div className="mb-10">
                        <h1 className="text-center font-bold text-xl uppercase">
                            Secure payment info
                        </h1>
                    </div>
                    <div className="mb-3">
                        <label className="block font-bold text-sm mb-2 ml-1">Name on card</label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-1 mb-1 border-2 border-gray-200 rounded-md focus:outline-none"
                            placeholder="Your Name"
                            type="text"
                            defaultValue={user?.displayName}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block font-bold text-sm mb-2 ml-1">Card number</label>
                        <CardNumberElement
                            id="card-number"
                            className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md"
                            options={{
                                showIcon: true,
                                placeholder: "Card Number",
                            }}
                        />
                    </div>
                    <div className="mb-3 -mx-2 flex justify-between items-end">
                        <div className="px-2">
                            <label
                                htmlFor="expire-date"
                                className="block font-bold text-sm mb-2 ml-1"
                            >
                                Expiration date
                            </label>
                            <CardExpiryElement
                                id="expire-date"
                                className="px-3 py-2 mb-1 border-2 border-gray-200 rounded-md"
                            />
                        </div>
                        <div className="px-2">
                            <label htmlFor="cvc" className="block font-bold text-sm mb-2 ml-1">
                                Security code
                            </label>
                            <CardCvcElement
                                id="cvc"
                                className="px-3 py-2 mb-1 border-2 border-gray-200 rounded-md"
                            />
                        </div>
                        <div className="px-2">
                            <label
                                htmlFor="postal-code"
                                className="block font-bold text-sm mb-2 ml-1"
                            >
                                Postal code
                            </label>
                            <input
                                onChange={(e) => setPostalCode(e.target.value)}
                                id="postal-code"
                                required
                                maxLength={5}
                                className="w-auto px-3 py-1 mb-1 border-2 border-gray-200 rounded-md focus:outline-none"
                            />
                        </div>
                    </div>
                    {errorMassage && (
                        <div className="">
                            <span className="text-red-600">{errorMassage}</span>
                        </div>
                    )}
                    {transactionId && (
                        <div className="">
                            <span className="text-green-600 center">Your Transaction ID: {transactionId}</span>
                        </div>
                    )}
                    <div>
                        <button className="block w-full max-w-xs mx-auto bg-primary hover:bg-primary/90 focus:bg-primary/80 text-white rounded-lg px-3 py-3 font-semibold">
                            Pay Now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckOutForm;