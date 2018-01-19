const schemas = require('./schemas.js');
const _ = require('lodash');
const db = require('../db.js');

const Blog = function (data) {
    this.data = this.sanitize(data);
}

Blog.prototype.data = {}
Blog.prototype.get = (name) => {
    return this.data[name];
}
Blog.prototype.set = (name, val) => {
    this.data[name] = val;
}

// sync data with Blog from schemas
// call on saving, creating, when data is being sent to Blog
Blog.sanitize = (data) => {
    data = data || {};
    schema = schemas.Blog;
    return _.pick(_.defaults(data, schema), _.keys(schema));
}

Blog.Create = function(data) {
    this.data = this.sanitize(data);

}

Blog.GetAllPosts = function(id) {

}

Blog.Delete = function(id) {

}

module.exports = Blog;