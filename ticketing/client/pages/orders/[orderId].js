import { useState, useEffect } from "react";
import StripeCheckout from 'react-stripe-checkout';
import { useRouter } from 'next/router';

import useRequest from '../../hooks/user-request';

const OrderShow = ({ order, currentUser }) => {
    const router = useRouter();

    const {
        doRequest,
        errors
    } = useRequest({
        url: '/api/payments',
        method: 'POST',
        body: {
            orderId: order.id,
        },
        onSuccess: () => {
            router.push('/orders');
        }
    })

    const [time, setTime] = useState(() => {
        const timeToExpire = new Date(order.expiresAt) - new Date();
        return Math.floor(timeToExpire / 1000);
    });

    useEffect(() => {
        const timeout = setInterval(() => {
            setTime(time => time - 1);
        }, 1000)
        return () => {
            clearInterval(timeout);
        }
    }, []);

    const retriveToken = (token) => {
        const { id } = token;
        doRequest({ token: id });
    };

    return (
        <div>
            <h1>Purchased {order?.ticket?.title}</h1>
            {
                time > 0 ? (
                    <p>You have <strong>{time}</strong> seconds left to order</p>
                ) : (
                    <p>Your order have been cancelled</p>
                )
            }
            {errors}
            {
                time > 0 && (
                    <StripeCheckout
                        token = {retriveToken}
                        stripeKey = "pk_test_5GQiqPEad7kBv0pjX8QyWISZ"
                        amount = {order.ticket.price * 100}
                        email = {currentUser.email}
                    />
                )
            }
        </div>
    )
};

OrderShow.getInitialProps = async (context, client, currentUser) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    return {
        order: data,
    };
};

export default OrderShow;