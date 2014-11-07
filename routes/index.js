module.exports = function (context) {
    return {
        pre: function (req, res, next) {
            console.log(req.url);
            next();
        },
        index: function (req, res) {
            res.render('');
        },
        signup: function (req, res) {
            res.render('register');
        },
        cleanup: function (req, res) {
            res.status(404).render('error/404');
        },
        signout: function (req, res) {
            req.logout();
            res.redirect('/');
        },
        logging: {
            pushEvents: function (req) {
                console.log(req);
            }
        }
    };
};