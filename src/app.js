const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const postsRouter = require('./routes/posts');
const authRouter = require('./routes/auth');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/profile-avatars', express.static('public/profile-avatars'));

app.use('/auth', authRouter);
app.use('/posts', postsRouter);

module.exports = app;