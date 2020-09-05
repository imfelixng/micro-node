import { useEffect } from 'react';
import useRequest from '../../hooks/user-request';
import { useRouter } from 'next/router'

const SignOut =  () => {
    const router = useRouter()
    const {
        doRequest,
    } = useRequest({
        url: '/api/users/signout',
        method: 'POST',
        body: {},
        onSuccess: () => router.push('/')
    });

    useEffect(() => {
        doRequest()
    }, []);

    return <div>Signing out...</div>
};

export default SignOut;