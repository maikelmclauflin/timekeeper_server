module.exports = function (context) {
    function next_level(it, fun) {
        if (typeof it == 'object') return fun(it);
        return it;
    }
    return {
        context: context,
        fun: {
            slugify: context.db.slugify,
            class_parts: function (num) {
                if (num == 1) return 'wholes';
                if (num == 2) return 'havles';
                if (num == 3) return 'thirds';
                if (num == 4) return 'fourths';
                if (num == 5) return 'fifths';
                if (num == 6) return 'sixths';
                if (num == 7) return 'sevenths';
                if (num == 8) return 'eighths';
                if (num == 9) return 'nineths';
                if (num == 10) return 'tenths';
                if (num == 11) return 'elevenths';
                if (num == 12) return 'twelveths';
            },
            max_letters: function (text, size) {
                if (text) {
                    if (text.length > size) {
                        text = text.slice(0, size);
                        text += '...';
                    }
                }
                return text;
            },
            stringify: function (obj) {
                var str = '';
                if (obj) {
                    if (typeof obj == 'object') {
                        if (!Array.isArray(obj)) {
                            for (var a in obj) {
                                str = str + " " + a + "='" + obj[a] + "'";
                            }
                        }
                    }
                }
                return str;
            },
            copy: function (thing) {
                var copy = context.app.locals.fun.copy,
                    arr, i;
                if (typeof thing == 'object') {
                    if (Array.isArray(thing)) {
                        arr = [];
                        for (i = thing.length - 1; i >= 0; i--) {
                            arr[i] = next_level(thing[i], copy);
                        }
                    }
                    if (!Array.isArray(thing)) {
                        arr = {};
                        for (i in thing) {
                            arr[i] = next_level(thing[i], copy);
                        }
                    }
                }
                return arr;
            }
        },
        games: [{
            name: 'blokus',
            description: 'an awesome game'
        }],
        social_items: [{
            name: 'facebook',
            hover: '',
            link: 'facebook.com/mjvmclaughlin'
        }, {
            name: 'twitter',
            hover: '',
            link: 'twitter.com'
        }, {
            name: 'github',
            hover: '',
            link: 'https://github.com/mmclau14'
        }, {
            name: 'envelope',
            hover: 'Say Hi',
            link: 'https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=michael.j.mclaughlin20@gmail.com&body=Hey+Michael'
        }, {
            name: 'soundcloud'
        }],
        made_with_items: [{
            name: 'html5'
        }, {
            name: 'css3'
        }, {
            name: 'git'
        }, {
            name: 'node'
        }],
        nav_items: [{
            innerHTML: 'Home',
            attrs: {
                href: '/'
            },
            parent: {
                class: 'bubbles bubbleG1',
                id: 'track'
            }
        }, {
            innerHTML: 'Blog',
            attrs: {
                href: '/blog'
            },
            parent: {
                class: 'bubbles bubbleG1'
            }
        }, {
            innerHTML: 'Code',
            attrs: {
                href: '/code'
            },
            parent: {
                class: 'bubbles bubbleG1'
            }
        }, {
            innerHTML: 'Games',
            attrs: {
                href: '/games'
            },
            parent: {
                class: 'bubbles bubbleG1'
            }
        }, {
            innerHTML: 'Login',
            attrs: {
                // href: '/auth/google'
                href: '/login'
            }
        }, {
            innerHTML: 'Sign Up',
            attrs: {
                // href: '/auth/google'
                href: '/sign-up'
            }
        }]
    };
};
// {
//  innerHTML: '',
//  type: 'img',
//  parent: {
//      class: "bg-img mean-muggin bubbles",
//      id: 'mean-muggin',
//      'data-animation_settings': '{"type": 0, "start_pos": "center"}'
//  }
// },