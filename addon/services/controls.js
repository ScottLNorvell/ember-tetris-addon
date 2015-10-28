import Ember from 'ember';
import keyMap from '../utils/key-map';

const {
  Service,
  computed,
  inject,
  isPresent,
  $,
  run
} = Ember;

const raf = window.requestAnimationFrame;
const caf = window.cancelAnimationFrame;
const baseInterval = 1000;
const difficultyThreshold = 10;

let afID = null;

// TODO: get these from tetrominos.keys()?
const tetrominoTypes = ['t', 'z', 's', 'j', 'l', 'i', 'o'];
let ttrI = 0;

export default Service.extend({
  tetromino: inject.service(),
  played: inject.service(),
  scoring: inject.service(),
  bag: inject.service(),

  xPos: computed.alias('tetromino.xPos'),
  yPos: computed.alias('tetromino.yPos'),

  tetrominoType: computed.alias('tetromino.type'),

  playedSquares: computed.alias('played.squares'),

  downRect() {
    let tetromino = this.get('tetromino');
    let played = this.get('played');
    let playedSquares = this.get('playedSquares');
    if (tetromino.willCollide('down')) {
      // push locations into Played, check lines, remove
      let locations = tetromino.get('locations');
      let type = this.get('tetrominoType');
      for (let i = 0, len = locations.length; i < len; i++) {
        let {x,y} = locations[i];
        playedSquares.pushObject({x: x, y: y, type: type});
      }
      played.checkLines();
      tetromino.resetTetromino();
      return true;
    } else {
      this.incrementProperty('yPos');
      return false;
    }
  },
  rightRect() {
    if (!this.get('tetromino').willCollide('right')) {
      this.incrementProperty('xPos');
    }
  },
  leftRect() {
    if (!this.get('tetromino').willCollide('left')) {
      this.decrementProperty('xPos');
    }
  },
  changeTetromino() {
    ttrI = (ttrI + 1) % tetrominoTypes.length;
    this.set('tetrominoType', tetrominoTypes[ttrI]);
  },
  rotateTetromino() {
    this.get('tetromino').changeRotation();
  },

  playTetromino() {
    let played = false;
    while (!played) {played = this.downRect();}
  },

  paused: false,
  stopped: false,

  resetBoard() {
    // README: do we need a 'reset' service so we don't have to inject EVERY service here?
    this.get('scoring').resetScore();
    this.get('played').resetAll();
    this.get('bag').resetBag();
    this.get('tetromino').resetTetromino();
    this.setProperties({
      paused: false,
      stopped: false
    });
    run.next(() => this.setAutoFall());
  },

  onGameOver() {
    if (confirm('Game Over!!! Play again?')) {
      this.resetBoard();
    } else {
      // What should happen here????
      console.log('no more playing for you!');
    }
  },

  stopGame() {
    this.setProperties({
      paused: true,
      stopped: true
    });
    caf(afID);
    run.next(() => {
      this.onGameOver();
    });
  },

  pauseGame() {
    if (this.get('paused')) {
      this.set('paused', false);
      this.setAutoFall();
    } else {
      this.set('paused', true);
      caf(afID);
    }
  },

  now: null,

  linesCleared: computed.reads('scoring.lines'),
  fallInterval: computed('linesCleared', function() {
    let lines = this.get('linesCleared');
    return baseInterval - (lines * difficultyThreshold);
  }),

  autoFall(timestamp) {
    if (this.get('paused')) { return; }
    let now = this.get('now');
    let elapsed = timestamp - now;
    if (elapsed >= this.get('fallInterval')) {
      this.set('now', timestamp);
      this.downRect();
    }
    this.setAutoFall();
  },

  setAutoFall() {
    afID = raf(this.autoFall.bind(this));
  },

  _handleKeydown(e) {
    let map = this.get('paused') ? keyMap['paused'] : keyMap['playing'];
    let action = map[e.keyCode];
    if (isPresent(action)) {
      e.preventDefault();
      this[action]();
    }
  },

  setupControls() {
    $(document).on('keydown', this._handleKeydown.bind(this));
  },

  setup() {
    this.setupControls();
    run.next(() => this.setAutoFall());
  }
});
