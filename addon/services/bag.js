import Ember from 'ember';
import tetrominos from '../utils/tetrominos';
import shuffle from '../utils/shuffle';

const {
  Service,
  computed,
  on
} = Ember;

export default Service.extend({
  _setBag: on('init', function() {
    this.fillBag();
    this._dontStartYucky();
  }),

  _dontStartYucky() {
    // make sure we don't start with an s or z
    let bag = this.get('bag');
    let doNotStartWithThese = ['s', 'z'];
    while (doNotStartWithThese.indexOf(bag.get('lastObject')) >= 0) {
      let badGuy = bag.popObject();
      bag.unshiftObject(badGuy);
    }
  },

  queue: computed('bag.length', function() {
    let bag = this.get('bag');
    let len = bag.get('length');
    return bag.slice(len - 2, len);
  }),

  bag: Ember.A(),

  tetrominoTypes: computed(function() {
    return Object.keys(tetrominos);
  }),

  resetBag() {
    this.set('bag', Ember.A());
    this.fillBag();
    this._dontStartYucky();
  },

  fillBag() {
    let bag = this.get('bag');
    if (bag.get('length') < 4) {
      let newBag = shuffle(this.get('tetrominoTypes'));
      this.set('bag', newBag.concat(bag));
    }
  }
});
