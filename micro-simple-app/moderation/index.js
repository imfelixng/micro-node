const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    console.log('Received event: ', type);

    if (type === 'COMMENT_CREATED') {
        const status = data.content.includes('orange') ? 'rejected': 'approved';

        axios.post('http://event-bus-srv:4005/events', {
            type: 'COMMENT_MODERATED',
            data: {
                ...data,
                status,
            }
        });
    }
    res.send({});
});

app.listen(4003, () => {
    console.log('Listening on 4003');
});