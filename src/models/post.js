const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    owner: {required: true, type: Object},
    title: {required: true, type: String},
    text: {required: true, type: String},
    previewSrc: {required: false, type: String},
    likes: {required: false, default: 0, type: Number},
    dislikes: {required: false, default: 0, type: Number}
});
const Post = mongoose.model('Post', postSchema);

module.exports = Post; 