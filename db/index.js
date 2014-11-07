var mongo = require('mongodb'),
    db,
    postCollection,
    context,
    settings;
module.exports = db = {
    url: 'mongodb://localhost/passport',
    init: function (contextArg, callback) {
        context = contextArg;
        settings = context.settings;
        var dbConnection = new mongo.Db(settings.db.name, new mongo.Server(settings.db.host, settings.db.port, {}), {
            safe: true
        });
        dbConnection.open(function (err) {
            if (err) callback(err);
            postCollection = dbConnection.collection('post');
            postCollection.ensureIndex("slug", {
                unique: true
            }, function (err, indexName) {
                callback(err);
            });
        });
    },
    posts: {
        // Find all posts in reverse order (blog order)
        findAll: function (callback) {
            postCollection.find({
                viewable: true
            }).sort({
                created: -1
            }).toArray(function (err, posts) {
                callback(err, posts);
            });
        },
        // Fetch a particular post by its slug
        findOneBySlug: function (slug, callback) {
            postCollection.findOne({
                slug: slug
            }, function (err, post) {
                callback(err, post);
            });
        },
        // Insert a new post
        insert: function (post, callback) {
            post.slug = db.slugify(post.title);
            // Set the creation date/time
            post.created = new Date().valueOf();
            post.modified = post.created;
            post.viewable = true;
            delete post.submit;
            postCollection.insert(post, {
                safe: true
            }, function (err) {
                if (err) {
                    callback(err);
                } else {
                    callback(err, post);
                }
            });
        },
        remove: function (slug, callback) {
            postCollection.update({
                slug: slug
            }, {
                $set: {
                    viewable: false
                }
            }, function (err) {
                callback(err);
            });
        },
        // Insert a new post
        update: function (slug, post, callback) {
            // Set the creation date/time
            post.slug = db.slugify(post.title);
            post.modified = new Date().valueOf();
            delete post.submit;
            postCollection.update({
                slug: slug
            }, {
                $set: {
                    modified: post.modified,
                    slug: post.slug,
                    title: post.title,
                    content: post.content
                }
            }, function (err) {
                if (err) {
                    callback(err);
                } else {
                    callback(err, post);
                }
            });
        }
    },
    slugify: function (s) {
        // Everything not a letter or number becomes a dash
        s = s.replace(/[^A-Za-z0-9]/g, '-');
        // Consecutive dashes become one dash
        s = s.replace(/\-+/g, '-');
        // Leading dashes go away
        s = s.replace(/^\-/, '');
        // Trailing dashes go away
        s = s.replace(/\-$/, '');
        // If the string is empty, supply something so that routes still match
        if (!s.length) {
            s = 'none';
        }
        return s.toLowerCase();
    }
};
// var mongo = require('mongodb'),
//     assert = require('assert');
// module.exports = function (o) {
//     var Db = mongo.Db,
//         MongoClient = mongo.MongoClient,
//         Server = mongo.Server,
//         ReplSetServers = mongo.ReplSetServers,
//         ObjectID = mongo.ObjectID,
//         Binary = mongo.Binary,
//         GridStore = mongo.GridStore,
//         Code = mongo.Code,
//         BSON = mongo.pure().BSON,
//         db = new Db('integration_tests', new Server("127.0.0.1", 5432, {
//             auto_reconnect: false,
//             poolSize: 4
//         }), {
//             w: 0,
//             native_parser: false
//         });
//     // Establish connection to db
//     db.open(function (err, db) {
//         assert.equal(null, err);
//         // Add a user to the database
//         db.addUser('user', 'name', function (err, result) {
//             assert.equal(null, err);
//             // Authenticate
//             db.authenticate('user', 'name', function (err, result) {
//                 assert.equal(true, result);
//                 db.close();
//             });
//         });
//     });
// };