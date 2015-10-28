/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-tetris',
  included: function(app, parentAddon) {
    var target = (parentAddon || app);

    // Import the styles into vendor.css
    // TODO: make this optional?
    target.import('vendor/app.css');
  }
};
