import { useState } from 'react';
import useRequest from '../../hooks/user-request';
import { useRouter } from 'next/router'

const SignUp =  () => {
    const router = useRouter()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {
        doRequest,
        errors
    } = useRequest({
        url: '/api/users/signup',
        method: 'POST',
        body: { email, password },
        onSuccess: () => {
            router.push('/');
        }
    })

    const onSubmit = async (e) => {
        e.preventDefault();
        doRequest({
            onSuccess: () => {
                Router.push('/');
            }
        });
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input className="form-control" onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input className="form-control" type="password" onChange={e => setPassword(e.target.value)} />
            </div>
            {errors}
            <button className="btn btn-primary" type="submit">Sign Up</button>
        </form>
    )
};

export default SignUp;