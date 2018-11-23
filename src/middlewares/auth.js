const jwt = require('jsonwebtoken');
const config = require('../app.config');

module.exports = function authCheck(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.split(' ')[1]) {
        return res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.sendStatus(401);
        }
        req.userId = decoded.id;
        next();
    });
}