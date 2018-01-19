const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secret = 'tajnica';

const Comment = require('../models/Comment.js');
const VerifyToken = require('../auth/VerifyToken');

router.use(bodyParser.json());

router.get('/', function (req, res) {
    return res.send('ok');
})

router.delete('/:id', VerifyToken, function (req, res, next) {
    return Comment.Delete(res.params.id, req.userId).then((affectedRows) => {
        if (affectedRows == 0)
            return res.status(404).send('Comment doesnt exist');

        return res.status(200).send('OK');
    }).catch(err => {

        // some kind of unexpected error on server
        console.error(err);
        return res.status(500).send('Error on the server.');
    });
})

module.exports = router;