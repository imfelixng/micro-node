import axios from 'axios';

export default ({ req }) => {
    if (typeof window === 'undefined') {
        // SERVER
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers,
        });
    } else {
        // BROWSER
        return axios.create({
            baseURL: '/'
        });
    }
};

