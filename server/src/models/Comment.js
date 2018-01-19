const schemas = require('./schemas.js');
const _ = require('lodash');
const db = require('../db.js');

const Comment = function (data) {
    this.data = this.sanitize(data);
}

Comment.prototype.data = {}
Comment.prototype.get = (name) => {
    return this.data[name];
}
Comment.prototype.set = (name, val) => {
    this.data[name] = val;
}

// sync data with Comment from schemas
// call on saving, creating, when data is being sent to comment
Comment.sanitize = (data) => {
    data = data || {};
    schema = schemas.Comment;
    return _.pick(_.defaults(data, schema), _.keys(schema));
}

Comment.Create = async function (data, postid, userid) {
    data.post_id = postid;
    data.user_id = userid;
    this.data = this.sanitize(data);

}

Comment.Like = function(id, userid) {
    return db.select().from('comment_user_like').where({comment_id: id, user_id: userid}).then((row) => {

        // if user has not previously liked the post, like it now
        if(!row)
            db.insert({comment_id: id, user_id: userid}).into('comment_user_like').then((insertedRow) => {
                // coludnt insert, not valid id-s
                if(!insertedRow)
                    return null;
                
                // inserted row, user liked post
                return 1;
            });
        
        // user has already liked the post, cannot like again
        return 0;
    });
}

Comment.GetAllLikes = function(id) {
    return db.select().from('commet_user_like').where({comment_id: id});
}

Comment.Delete = function (id, userid) {
    db.select().from('comment').where({
        id: id
    }).first().then((comment) => {

        // comment with given id doesnt exist
        if (!comment)
            return null;

        // if comment was written by authenticated user, delete it
        if (comment.user_id == userid) {
            return db.delete().from('comment').where({
                id: comment.id
            });
        }

        // if comment is on a post which was created with authenticated user delete it, 
        // otherwise cannot delete it
        return db.select().from('post').where({
            id: comment.post_id
        }).first().then((post) => {

            // post was written by authenticated user, return number of affected rows by delete query(should be 1)
            if (post.user_id == userid)
                return db.delete().from('comment').where({
                    id: comment.id
                });

            // post wasnt written by authenticated user, cannot delete comment, 0 affected rows
            // comment exists but cannot be deleted
            return 0;
        });
    });
}

module.exports = Comment;