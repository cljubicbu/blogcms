const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secret = 'tajnica';

const Blog = require('../models/Blog.js');
const VerifyToken = require('../auth/VerifyToken');

router.use(bodyParser.json());

module.exports = router;