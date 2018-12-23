const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    owner: {required: true, type: Object},
    postId: {required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    text: {required: true, type: String},
    likes: {required: false, default: [], type: Array},
    dislikes: {required: false, default: [], type: Array},
    timestamp: {required: false, default: Date.now, type: Date}
});
const PostComment = mongoose.model('PostComment', commentSchema);

module.exports = PostComment;