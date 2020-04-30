const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    console.log(req.body);
    if (req.body.type === 'POST_CREATED') {
        posts[req.body.data.id] = {
            ...req.body.data,
            comments: []
        };
    }

    if (req.body.type === 'COMMENT_CREATED') {
        const post = posts[req.body.data.postId];
        post.comments.push({
            id: req.body.data.id,
            content: req.body.data.content
        });
    }

    res.send();
});

app.listen(4002, () => {
    console.log('Listening on 4002');
});