import useRequest from '../../hooks/user-request';
import { useRouter } from 'next/router';

const TicketShow = ({ ticket }) => {
    const router = useRouter();
    const {
        doRequest,
        errors
    } = useRequest({
        url: '/api/orders',
        method: 'POST',
        body: { ticketId: ticket.id },
        onSuccess: (order) => {
            router.push('/orders/[orderId]', `/orders/${order.id}`);
        }
    })

    const handlePurchase = () => {
        doRequest();
    }

    return (
        <div>
            <h1>{ticket.title}</h1>
            <h4>Price: {ticket.price}$</h4>
            <h4>Status: {ticket.orderId ? 'Reserved' : 'Available'}</h4>
            {errors}
            <button onClick = {handlePurchase} className = "btn btn-primary" disabled = {!!ticket.orderId}>Purchase</button>
        </div>
    )
};

TicketShow.getInitialProps = async (context, client, currentUser) => {
    const { ticketId } = context.query;
    const { data } = await client.get(`/api/tickets/${ticketId}`);
    return {
        ticket: data,
    };
};

export default TicketShow;