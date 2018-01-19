const schemas = require('./schemas.js');
const _ = require('lodash');
const db = require('../db.js');

const User = function (data) {
    this.data = this.sanitize(data);
}

User.prototype.data = {}
User.prototype.get = (name) => {
    return this.data[name];
}
User.prototype.set = (name, val) => {
    this.data[name] = val;
}

// sync data with user from schemas
// call on saving, creating, when data is being sent to user
User.sanitize = (data) => {
    data = data || {};
    schema = schemas.user;
    return _.pick(_.defaults(data, schema), _.keys(schema));
}

// insert user into database
User.Create = function (data) {
    this.data = this.sanitize(data);
    // try to find existing users with that username
    return this.FindByUsername(this.data.username).then((res) => {
        // there are users with this username, invalid username
        if (res) {
            return null;
        }
        // there arent any users with that username, insert into database and return id
        return db.insert(this.data).into('user').then((id) => {
            return id;
        });
    });
}

User.FindByUsername = function (username) {
    return db.select().from('user').where({
        username: username
    }).first();
}

User.FindById = function(id) {
    return db.select().from('user').where({
        id: id
    }).first();
}

User.Delete = function(id) {
    return db.delete().from('user').where({
        id: id
    });
}

module.exports = User;