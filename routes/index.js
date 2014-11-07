module.exports = function (context) {
    return {
        index: function (req, res) {
            res.render('');
        },
        cleanup: function (req, res) {
            res.status(404).render('error/404');
        }
    };
};