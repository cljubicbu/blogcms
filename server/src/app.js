const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const UserController = require('./controllers/UserController');
const PostController = require('./controllers/PostController');
const CommentController = require('./controllers/CommentController');
const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
// main router for all routes after /api
const router = express.Router();
router.use('/users', UserController);
router.use('/posts', PostController);
router.use('/comments', CommentController);

// prefix all routes with /api
app.use('/api', router);

module.exports = app;