const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const _ = require('lodash');
const User = require('../models/user');
const config = require('../app.config');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/profile-avatars/');
    },
    filename: (req, file, cb) => {
        const fileName = file.fieldname + Date.now() + path.extname(file.originalname);
        cb(null, fileName);
    }
});

router.post('/register', multer({storage}).single('avatar'), (req, res) => {
    const user = {
        ...req.body,
        password: bcrypt.hashSync(req.body.password, 8)
    };

    if (req.file) {
        user.avatarSrc = '/profile-avatars/' + req.file.filename;
    }

    User.create(user, (err, user) => {
        if (err) {
            return res.sendStatus(500);
        }
        const token = jwt.sign({id: user._id}, config.secret, {expiresIn: 86400});
        res.send({token, user: _.omit(user.toObject(), 'password')});
    });
})

router.post('/login', (req, res) => {

    User.findOne({email: req.body.email}, (err, user) => {
        if (err) {
            return res.sendStatus(500);
        } else if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.sendStatus(422);
        } else if (!user) {
            return res.sendStatus(400);
        } else {
            const token = jwt.sign({id: user._id}, config.secret, {expiresIn: 86400});
            return res.send({token, user: _.omit(user.toObject(), 'password')});
        }
    })

});

module.exports = router;