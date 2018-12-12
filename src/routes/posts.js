const router = require('express').Router();
const Post = require('../models/post');
const PostComment = require('../models/post-comment');
const User = require('../models/user');
const authCheck = require('../middlewares/auth');

router.get('/', (req, res) => {
    const page = +req.query.page || 0;
    const limit = +req.query.limit || 0;
    let fetchedPosts = [];
    Post.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .then(posts => {
            fetchedPosts = posts;
            return Post.count();
        })
        .then(postCount => res.json({posts: fetchedPosts, count: postCount}));
});

router.get('/:id', (req, res) => {
   Post.findById(req.params.id).then(post => res.json(post));
});

router.post('/', authCheck, (req, res) => {
    getUserPreview(req.userId)
        .then(owner => {
            return Post.create({
                owner,
                title: req.body.title,
                text: req.body.text
            });
        })
        .then(post => res.json({postId: post._id}));
});

router.put('/:id', authCheck, (req, res) => {
    Post.updateOne({_id: req.params.id, 'owner.id': req.userId}, req.body)
        .then((result) => {
            console.log(result);
            res.sendStatus(200);
        });
});

router.delete('/:id', authCheck, (req, res) => {
   Post.deleteOne({_id: req.params.id, 'owner.id': req.userId})
       .then(() => res.sendStatus(200));
});

router.get('/:id/comments', (req, res) => {
    const page = +req.query.page || 0;
    const limit = +req.query.limit || 0;
    let fetchedComments = [];
    PostComment.find({postId: req.params.id})
        .skip(page * limit)
        .limit(limit)
        .then(comments => {
            fetchedComments = comments;
            return PostComment.count();
        })
        .then(commentsCount => res.json({comments: fetchedComments, count: commentsCount}));
});

router.post('/:id/comments', authCheck, (req, res) => {
    getUserPreview(req.userId)
        .then(owner => {
            return PostComment.create({
                owner,
                postId: req.params.id,
                text: req.body.text
            });
        })
        .then(comment => res.json({coomentId: comment._id}));
});

router.put('/:id/comments/:commentId', authCheck, (req, res) => {
   PostComment.updateOne({_id: req.params.commentId, 'owner.id': req.userId})
       .then(() => res.sendStatus(200));
});

router.delete('/:id/comments/:commentId', authCheck, (req, res) => {
   PostComment.deleteOne({_id: req.params.commentId, 'owner.id': req.userId})
       .then(() => res.sendStatus(200));
});

function getUserPreview(userId) {
    return User.findById(userId)
        .then(user => {
            return {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                avatarSrc: user.avatarSrc
            };
        });
}

module.exports = router;