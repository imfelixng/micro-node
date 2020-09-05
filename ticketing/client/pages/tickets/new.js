import { useState } from "react";
import { useRouter } from 'next/router';

import useRequest from '../../hooks/user-request';

const NewTicket = () => {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');

    const {
        doRequest,
        errors
    } = useRequest({
        url: '/api/tickets',
        method: 'POST',
        body: { title, price },
        onSuccess: () => {
            router.push('/');
        }
    })

    const onSubmit = async (e) => {
        e.preventDefault();
        doRequest({});
    };

    const handleBurPrice = (e) => {
        const value = parseFloat(price);

        if (isNaN(value)) {
            return;
        }

        setPrice(value.toFixed(2))
    };

    return (
        <div>
            <h1>Create a Ticket</h1>
            <form onSubmit = {onSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        value = {title}
                        className="form-control"
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input
                        value = {price}
                        className="form-control"
                        type="number"
                        onChange={e => setPrice(e.target.value)}
                        onBlur = {handleBurPrice}
                    />
                </div>
                {errors}
                <button className="btn btn-primary" type="submit">Create</button>
            </form>
        </div>
    )
};

export default NewTicket;