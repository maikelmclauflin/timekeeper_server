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
            postCollection = dbConnection.collection('userData');
            postCollection.ensureIndex("username", {
                unique: true
            }, function (err, indexName) {
                callback(err);
            });
        });
    },
    userData: {
        findAllUsers: function (callback) {
            postCollection.find({
                viewable: true
            }).sort({
                created: -1
            }).toArray(function (err, posts) {
                callback(err, posts);
            });
        },
        // Fetch a particular post by its slug
        findOneByUsername: function (username, callback) {
            postCollection.findOne({
                username: username
            }, function (err, post) {
                callback(err, post);
            });
        },
        // Insert a new post
        makeNewUser: function (userObj, callback) {
            var privacy,
                now = new Date().valueOf();
            if (userObj.status === undefined) privacy = 'private'; // hidden, private, collaborative, public
            postCollection.insert({
                created: now,
                modified: now,
                viewable: true,
                privacy: privacy
            }, {
                safe: true
            }, function (err) {
                if (err) {
                    callback(err);
                } else {
                    callback(err, post);
                }
            });
        },
        hideUser: function (username, callback) {
            postCollection.update({
                username: username
            }, {
                $set: {
                    viewable: false
                }
            }, function (err) {
                callback(err);
            });
        },
        unhideUser: function (username, callback) {
            postCollection.update({
                username: username
            }, {
                $set: {
                    viewable: true
                }
            }, function (err) {
                callback(err);
            });
        },
        // Insert a new post
        update: function (username, data, callback) {
            // Set the creation date/time
            data.modified = new Date().valueOf();
            delete post.submit;
            postCollection.update({
                username: username
            }, {
                $set: {
                    modified: data.modified,
                    currentProject: data.project
                },
                $pushAll: {
                    project: data.events
                }
            }, function (err) {
                if (err) {
                    callback(err);
                } else {
                    callback(err, data);
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