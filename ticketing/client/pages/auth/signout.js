import { useEffect } from 'react';
import useRequest from '../../hooks/user-request';
import { useRouter } from 'next/router'

export default () => {
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