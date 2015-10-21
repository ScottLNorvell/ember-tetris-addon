/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-tetris',
  included: function(app, parentAddon) {
    var target = (parentAddon || app);

    target.import('vendor/app.css');
  }
};
