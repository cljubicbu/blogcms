const schemas = require('./schemas.js');
const _ = require('lodash');
const db = require('../db.js');

const Post = function (data) {
    this.data = this.sanitize(data);
}

Post.prototype.data = {}
Post.prototype.get = (name) => {
    return this.data[name];
}
Post.prototype.set = (name, val) => {
    this.data[name] = val;
}

// sync data with Post from schemas
// call on saving, creating, when data is being sent to post
Post.sanitize = (data) => {
    data = data || {};
    schema = schemas.Post;
    return _.pick(_.defaults(data, schema), _.keys(schema));
}

// insert Post into database
Post.Create = function (data) {
    this.data = this.sanitize(data);

    return db.insert(data).into('post');
}

Post.Update = function (data) {
    // TODO: write this smart
}

// find post by id
Post.FindById = function (id) {

    return db.select().from('post').where({
        id: id
    }).first();
}

Post.GetAllComments = function (id) {

    return db.select().from('comment').where({
        post_id: id
    });
}

Post.GetAllPosts = function () {

    return db.select().from('post');
}

Post.Delete = function (id) {

    return db.delete().from('post').where({
        id: id
    });
}

module.exports = Post;