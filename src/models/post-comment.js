const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    owner: {required: true, type: Object},
    postId: {required: true, type: String},
    text: {required: true, type: String},
    likes: {default: 0, type: Number},
    dislikes: {default: 0, type: Number}
});
const PostComment = mongoose.model('PostComment', commentSchema);

module.exports = PostComment;