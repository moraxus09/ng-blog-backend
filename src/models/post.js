const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    owner: {required: true, type: Object},
    title: {required: true, type: String},
    text: {required: true, type: String},
    previewSrc: {required: false, type: String},
    likes: {required: false, default: [], type: Array},
    dislikes: {required: false, default: [], type: Array},
    timestamp: {required: false, default: Date.now, type: Date}
});
const Post = mongoose.model('Post', postSchema);

module.exports = Post; 