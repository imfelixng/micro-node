const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    console.log('Received event: ', type);
    if (type === 'POST_CREATED') {
        posts[data.id] = {
            ...data,
            comments: []
        };
    }

    if (type === 'COMMENT_CREATED') {
        const post = posts[data.postId];
        post.comments.push({
            id: data.id,
            content: data.content,
            status: data.status
        });
    }

    if (type === 'COMMENT_UPDATED') {
        const post = posts[data.postId];
        const comment = post.comments.find(item => item.id === data.id);
        comment.status = data.status;
    }
};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;
    handleEvent(type, data);

    res.send();
});

app.listen(4002, async () => {
    console.log('Listening on 4002');
    const res = await axios.get('http://event-bus-srv:4005/events');

    for (let event of res.data.events) {
        const { type, data } = event;
        handleEvent(type, data);
    }
});