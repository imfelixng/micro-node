const { default: Link } = require("next/link")

const LandingPage = ({ currentUser, tickets }) => {
    console.log('Client App');
    const ticketList = tickets?.map((ticket, index) => {
        return (
            <tr key = {ticket.id}>
                <td>{index + 1}</td>
                <td><Link  href = "/tickets/[ticketId]" as = {`/tickets/${ticket.id}`}><a>{ticket.title}</a></Link></td>
                <td>{ticket.price}</td>
            </tr>
        )
    });

    return (
        <div>
            <h1>Tickets</h1>
            <table className = "table">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Title</th>
                        <th>Price ($)</th>
                    </tr>
                </thead>
                <tbody>
                    {ticketList || (<div>Do not have any tickets yet!</div>)}
                </tbody>
            </table>
        </div>
    );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/tickets');
    return {
        tickets: data
    };
};

export default LandingPage;