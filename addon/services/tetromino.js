import Ember from 'ember';
import tetrominos from '../utils/tetrominos';
import rotations from '../utils/rotations';
import toSquareKey from '../utils/to-square-key';

const {
  Service,
  computed,
  inject,
  on,
  isPresent
} = Ember;

const [
  rightLimit,
  leftLimit,
  downLimit
] = [9,0,21];

export default Service.extend({
  setType: on('init', function() {
    let type = this.get('bag.bag').popObject();
    this.set('type', type);
  }),

  played: inject.service(),
  controls: inject.service(),
  bag: inject.service(),
  squareSet: computed.alias('played.squareSet'),

  xPos: 0,
  yPos: 0,

  scale: 30,

  type: null,

  box: computed('type', 'scale', function() {
    let {
      scale,
      type
    } = this;
    let [w, h] = tetrominos[type]['box'];
    return {
      w: w * scale,
      h: h * scale
    };
  }),

  positions: computed('type', function() {
    let type = this.get('type');
    let data = tetrominos[type].positions;
    let positions = [];
    for (let i = 0, len = data[0].length; i < len; i++) {
      let position = {
        x: data[0][i],
        y: data[1][i]
      };
      positions.push(position);
    }
    return positions;
  }),

  _applyTransformation(positions, _rotation) {
    let rotation = isPresent(_rotation) ? _rotation : this.get('rotation');
    let xPos = this.get('xPos');
    let yPos = this.get('yPos');
    let [originX, originY] = this.get('rotationOrigin'); // jshint ignore:line
    return positions.map((pos) => {
      let {x,y} = pos;
      if (rotation) {
        [x, y] = eval(rotations[rotation]);
      }
      return {
        x: x + xPos,
        y: y + yPos
      };
    });
  },

  locations: computed('positions', 'xPos', 'yPos', 'rotation', 'rotationOrigin', function() {
    let positions = this.get('positions');
    return this._applyTransformation(positions);
  }),

  rotation: 0,

  origin: computed('type', function() {
    let type = this.get('type');
    return tetrominos[type].origin;
  }),

  rotationOrigin: computed('type', function() {
    let type = this.get('type');
    return tetrominos[type].rotationOrigin;
  }),

  changeRotation() {
    let {
      rotation,
      type
    } = this;
    let rotations = tetrominos[type].rotations;
    if (rotations) {
      let newRotation = (rotation + 1) % rotations;
      if (!this.cannotRotate(newRotation)) {
        this.set('rotation', newRotation);
      }
    }
  },

  resetTetromino() {
    let bag = this.get('bag');
    let nextType = bag.get('bag').popObject();
    this.setProperties({
      xPos: 0,
      yPos: 0,
      rotation: 0,
      type: nextType
    });
    if (this.doesNotFit()) {
      this.get('controls').stopGame();
    }
    bag.fillBag();
  },

  doesNotFit() {
    let locations = this.get('locations');
    let squareSet = this.get('squareSet');
    return locations.any(pt => squareSet.has(toSquareKey(pt)));
  },

  willCollide(direction) {
    let locations = this.get('locations');
    let squareSet = this.get('squareSet');
    switch (direction) {
      case 'right':
        return locations.any((loc) => {
          let {x,y} = loc;
          return loc.x === rightLimit || squareSet.has(toSquareKey({x: x + 1, y: y}));
        });
      case 'left':
        return locations.any((loc) => {
          let {x,y} = loc;
          return loc.x === leftLimit || squareSet.has(toSquareKey({x: x - 1, y: y}));
        });
      case 'down':
        return locations.any((loc) => {
          let {x,y} = loc;
          return y === downLimit || squareSet.has(toSquareKey({x: x, y: y + 1}));
        });
    }
  },

  cannotRotate(rotation) {
    let positions = this.get('positions');
    let squareSet = this.get('squareSet');
    let locations = this._applyTransformation(positions, rotation);
    return locations.any((loc) => {
      return loc.x > rightLimit || loc.x < leftLimit || loc.y > downLimit || squareSet.has(toSquareKey(loc));
    });
  }
});
