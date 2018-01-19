const jwt = require('jsonwebtoken');

const secret = 'tajnica';

// header : x-access-token > tokenValue
function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];

    // no token provided
    if (!token)
        return res.status(403).send({
            auth: false,
            message: 'No token provided.'
        });

    jwt.verify(token, secret, function (err, decoded) {
        // inactive/wrong token provided
        if (err)
            return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });

        // if everything good, save to request for use in other routes
        // tokens from registring and login are different so we have to equalize the output 
        // TODO: register token has an array of id-s? why? while login token only has one id value

        if (decoded.id.length)
            req.userId = decoded.id[0];
        else
            req.userId = decoded.id;

        next();
    });
}

module.exports = verifyToken;