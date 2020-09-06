import Link from 'next/link';

const OrderIndex = ({ orders }) => {
    return (
        <ul>
            {
                orders.map (order => {
                    return (
                        <li key = {order.id}>
                            <Link href = "/orders/[orderId]" as = {`/orders/${order.id}`}>
                                <a>{order.ticket.title} - {order.status}</a>
                            </Link>
                        </li>
                    );
                })
            }
        </ul>
    )
};

OrderIndex.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/orders');
    return {
        orders: data
    };
};


export default OrderIndex;