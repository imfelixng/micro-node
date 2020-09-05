import axios from 'axios';
import { useState } from 'react';

const useRequest =  ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async () => {
        try {
            setErrors(null);
            const response = await axios({
                method,
                url,
                data: body
            });
            if (onSuccess) {
                onSuccess(response.data);
            }
            return response.data;
        } catch (e) {
            console.log(e);
            const { errors } = e.response?.data || {};
            setErrors(
                <div className="alert alert-danger">
                    <h4>Ooops...</h4>
                    <ul className="ml-0">
                        {
                            errors?.map(err => <li key={err.message}>{err.message}</li>) || <li>{e?.message}</li>
                        }
                    </ul>

                </div>
            );
        }
    };

    return {
        doRequest,
        errors,
    }
};

export default useRequest;