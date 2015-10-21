import Ember from 'ember';
import toSquareKey from '../utils/to-square-key';

const {
  Service,
  computed,
  inject,
  isPresent
} = Ember;

// TODO: make squares a special object that adds to set on pushObject?
// make this better!

export default Service.extend({
  scoring: inject.service(),
  squares: computed(function() {
    let squares = [];
    squares.__pushObject = squares.pushObject;
    let squareSet = this.get('squareSet');
    let service = this;
    squares.pushObject = function(_pt) {
      // README: moving lines into function since we reset it...
      // If we don't have to anymore, we'll move it back out...
      // squareSet just get's cleared, so we're good...
      // TODO: look into making lines a map?
      let lines = service.get('lines');
      let pt = Ember.Object.create(_pt);
      squareSet.add(toSquareKey(pt));
      if (lines[pt.y]) {
        lines[pt.y].pushObject(pt);
      } else {
        lines[pt.y] = [pt];
      }
      this.__pushObject(pt);
    };
    return squares;
  }),

  lines: computed(function() {
    return Ember.Object.create();
  }),

  squareSet: computed(function() {
    return new Set();
  }),

  resetStores() {
    let squareSet = this.get('squareSet');
    let squares = this.get('squares');
    let newLines = Ember.Object.create();
    squareSet.clear();
    for (let i = 0, len = squares.length; i < len; i++) {
      let pt = squares[i];
      if (newLines[pt.y]) {
        newLines[pt.y].pushObject(pt);
      } else {
        newLines[pt.y] = [pt];
      }
      squareSet.add(toSquareKey(pt));
    }
    this.set('lines', newLines);
  },

  resetAll() {
    // TODO: do we need to go through and destroy all of the squares?
    this.get('squares').clear();
    this.get('squareSet').clear();
    this.set('lines', Ember.Object.create());
  },

  shiftLines(linesToDelete) {
    let squares = this.get('squares');
    for (let i = 0, len = squares.length; i < len; i++) {
      let pt = squares[i];
      let shift = this._determineShift(linesToDelete, pt);
      if (shift) {
        pt.set('y', pt.get('y') + shift);
      }
    }
  },

  _determineShift(linesToDelete, pt) {
    let shift = 0;
    for (let i = 0, len = linesToDelete.length; i < len; i++) {
      if (pt.y < linesToDelete[i]) { shift++; }
    }
    return shift;
  },

  deleteLines() {
    let squares = this.get('squares');
    let toDelete = squares.filter(pt => pt.get('type') === 'x');
    toDelete.forEach((pt) => {
      squares.removeObject(pt);
      pt.destroy();
    });
  },

  markForDeletion() {
    let lines = this.get('lines');
    let lineNos = Object.keys(lines);
    let linesToDelete = [];
    for (let i = 0, len = lineNos.length; i < len; i++) {
      let yVal = lineNos[i];
      let line = lines[yVal];
      if (line.length === 10) {
        linesToDelete.push(yVal);
        line.setEach('type', 'x');
      }
    }
    return linesToDelete;
  },

  checkLines() {
    let linesToDelete = this.markForDeletion();
    if (isPresent(linesToDelete)) {
      // Delete lines completed
      this.deleteLines();
      // Shift remaining squares down
      this.shiftLines(linesToDelete);
      // reset the ref objects
      this.resetStores();
      // calculate the score
      this.get('scoring').addScore(linesToDelete);
    }
  }
});
