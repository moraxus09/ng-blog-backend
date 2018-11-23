const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multiparty = require('multiparty');
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const User = require('../models/user');
const config = require('../app.config');


router.post('/register', (req, res) => {
    
    const form = new multiparty.Form();

    new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (!err) {
                const user = {};
                for (const key in fields) {
                    user[key] = fields[key][0];
                }
                user.password = bcrypt.hashSync(user.password, 8);

                if (files['avatar']) {
                    const avatar = files['avatar'][0];
                    const fileName = Date.now() + path.extname(avatar.originalFilename);
                    fs.moveSync(avatar.path, 'public/profile-avatars/' + fileName);
                    user.avatarSrc = '/profile-avatars/' + fileName;
                };

                resolve(user);
            } else {
                reject(err);
            }
        })
    })
    .then(user => {
        return User.create(user, (err, user) => {
            if (err) {
                return res.sendStatus(500);
            }
    
            const token = jwt.sign({id: user._id}, config.secret, {expiresIn: 86400});
    
            res.send({token, user: _.omit(user.toObject(), 'password')});
        });
    })
    .catch(() => res.sendStatus(500));
});

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