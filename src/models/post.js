const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    owner: {required: true, type: Object},
    title: {required: true, type: String},
    text: {required: true, type: String},
    likes: {default: 0, type: Number},
    dislikes: {default: 0, type: Number}
});
const Post = mongoose.model('Post', postSchema);

module.exports = Post;