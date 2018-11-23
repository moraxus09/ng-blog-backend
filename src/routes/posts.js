const router = require('express').Router();
const Post = require('../models/post');
const PostComment = require('../models/post-comment');
const User = require('../models/user');
const authCheck = require('../middlewares/auth');

router.use(authCheck);

router.get('/', (req, res) => {
    Post.find({}).then(posts => res.json(posts))
});

router.get('/:id', (req, res) => {
   Post.find({_id: req.params.id}).then(post => res.json(post));
});

router.post('/', (req, res) => {
    getUserPreview(req.userId)
        .then(owner => {
            return Post.create({
                owner,
                title: req.body.title,
                text: req.body.text
            })
        })
        .then(post => res.json({postId: post._id}));
});

router.put('/:id', (req, res) => {
   Post.updateOne({_id: req.params.id}, req.body)
       .then(() => res.sendStatus(200));
});

router.delete('/:id', (req, res) => {
   Post.deleteOne({_id: req.params.id})
       .then(() => res.sendStatus(200));
});

router.get('/:id/comments', (req, res) => {
    PostComment.find({postId: req.params.id})
        .then(comments => res.json(comments));
});

router.post('/:id/comments', (req, res) => {
    getUserPreview(req.userId)
        .then(owner => {
            return Post.create({
                owner,
                postId: req.params.id,
                text: req.body.text
            });
        })
});

router.put('/:id/comments/:commentId', (req, res) => {
   PostComment.updateOne({_id: req.params.commentId})
       .then(() => res.sendStatus(200));
});

router.delete('/:id/comments/:commentId', (req, res) => {
   PostComment.deleteOne({_id: req.params.commentId})
       .then(() => res.sendStatus(200));
});

function getUserPreview(userId) {
    return User.find({_id: userId})
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