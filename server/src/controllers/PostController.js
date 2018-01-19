const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secret = 'tajnica';

const Post = require('../models/Post.js');
const VerifyToken = require('../auth/VerifyToken');

router.use(bodyParser.json());
//req.query > values behined ?
// req.params > values in url /:value/:value2
//Get a post
router.get('/:id', function (req, res) {

    Post.FindById(req.params.id).then((post) => {
        if (!post)
            return res.status(404).send("Not found.");

        return res.status(200).send(post);
    }).catch(err => {

        // some kind of unexpected error on server
        console.error(err);
        return res.status(500).send('Error on the server.');
    });
});

//get all posts
router.get('/', function (req, res) {

    Post.GetAll().then((posts) => {
        // if no posts empty array is returned
        return res.status(200).send(posts);
    }).catch(err => {

        // some kind of unexpected error on server
        console.error(err);
        return res.status(500).send('Error on the server.');
    });
});

router.get('/:postid/comments', function (req, res) {

    Post.GetAllComments(req.params.postid).then((comments) => {

        return res.status(200).send(comments);
    }).catch(err => {

        console.error(err);
        return res.status(500).send('Error on the server.');
    });
});

module.exports = router;