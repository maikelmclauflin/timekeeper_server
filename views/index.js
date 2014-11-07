var ejs = require('ejs'),
    fs = require('fs'),
    _ = require('underscore'),
    options,
    templates = {};
module.exports = view = {
    init: function (optionsArg, callback) {
        options = optionsArg;
        if (!options.viewDir) {
            throw new Error('options.viewDir is required, please tell me where the views are.');
        }
        callback();
    },
    page: function (template, data) {
        if (typeof template != 'string') {
            data = template;
            template = 'default';
        }
        data.slots.body = view.partial(template, data);
        if (!data) data = {};
        _.defaults(data.slots, {
            layout: 'default'
        });
        if (data.slots.layout === false) return data.slots.body;
        return view.partial(data.slots.layout, {
            slots: data.slots
        });
    },
    partial: function (page, data) {
        if (!templates[page]) {
            templates[page] = ejs.compile(fs.readFileSync(options.viewDir + '/' + page + '.ejs', 'utf8'));
        }
        if (!data.partial) {
            data.partial = function (partial, partialData) {
                if (!partialData) {
                    partialData = {};
                }
                _.defaults(partialData, {
                    slots: data.slots
                });
                return view.partial(partial, partialData);
            };
        }
        _.defaults(data, {
            slots: {},
            _: _
        });
        return templates[page](data);
    }
};