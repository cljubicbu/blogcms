schemas = {
    user: {
        id: null,
        username: null,
        password: null,
        first_name: null,
        last_name: null
    },
    post: {
        id: null,
        name: null,
        content: null,
        blog_id: null,
        time: null,
        category_id: null
    },
    comment: {
        id: null,
        content: null,
        post_id: null,
        user_id: null,
        time: null
    },
    blog: {
        id: null,
        uri: null,
        user_id: null
    }
};

module.exports = schemas;