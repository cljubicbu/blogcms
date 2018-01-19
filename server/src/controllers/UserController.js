const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secret = 'tajnica';

const User = require('../models/User.js');
const VerifyToken = require('../auth/VerifyToken');

router.use(bodyParser.urlencoded({
    extended: true
}));

// register a new user
// header : content-type > application/header
router.post('/register', function (req, res) {

    //hash password
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    // replace password from request with hashed password 
    req.body.password = hashedPassword;

    // try to register the user
    return User.Create(req.body).then((id) => {

        // user was not created
        if (id == null) {
            return res.status(500).send("There was a problem registring the user");
        }

        // user was created, generate a token and return it
        const token = jwt.sign({
            id: id
        }, secret, {
            expiresIn: 86400
        });

        return res.status(200).send({
            auth: true,
            token: token
        });
    }).catch(err => {

        // some kind of unexpected error on server
        console.error(err);
        return res.status(500).send('Error on the server.');
    });
});

// get info about currently authorized user
router.get('/userInfo', VerifyToken, function (req, res, next) {

    // verify token middleware, errors handled in there
    // check if user exists in database
    // token can still be active even though user was deleted from the database(token active 24h, user deleted after 12h) > jwt.verify will return the id
    // so we have to double check the database
    User.FindById(req.userId).then((user) => {
        // user was deleted, but token is still active
        if (!user)
            return res.status(500).send({
                auth: false,
                message: 'User deleted'
            });

        // user exists
        return res.status(200).send({
            id: req.userId
        });
    }).catch(err => {

        // some kind of unexpected error on server
        console.error(err);
        return res.status(500).send('Error on the server.');
    });

});

// header : content-type > application/header
// login an existting user
router.post('/login', function (req, res) {

    // try to find the user 
    return User.FindByUsername(req.body.username).then((user) => {

        // no user
        if (!user)
            return res.status(404).send('No user found.');

        // verify password
        var passIsValid = bcrypt.compareSync(req.body.password, user.password);

        //wrong password
        if (!passIsValid)
            return res.status(401).send({
                auth: false,
                token: null
            });

        // user exists and password is correct, generate a token and return it
        var token = jwt.sign({
            id: user.id
        }, secret, {
            expiresIn: 86400
        });

        res.status(200).send({
            aut: true,
            token: token
        });
    }).catch(err => {

        // some kind of unexpected error on server
        console.error(err);
        return res.status(500).send('Error on the server.');
    });
});

// delete a user
router.delete('/deleteUser', VerifyToken, function (req, res, next) {

    return User.Delete(req.userId).then((affectedRows) => {
        if (affectedRows == 0)
            return res.status(404).send('Cannot delete. User not found');

        return res.status(200).send('User deleted.');
    }).catch(err => {

        // some kind of unexpected error on server
        console.error(err);
        return res.status(500).send('Error on the server.');
    });
});

module.exports = router;