import Ember from 'ember';
import layout from '../templates/components/ttr-board';

const {
  Component,
  computed,
  inject,
  on,
  isPresent
} = Ember;

export default Component.extend({
  _setScale: on('init', function() {
    let width = this.get('width');

    if (isPresent(width)) {
      let scale = Math.floor(width/10);
      this.set('scale', scale);
    }
  }),
  layout: layout,
  classNames: ['tetris-board'],
  tetromino: inject.service(),
  played: inject.service(),
  playedSquares: computed.alias('played.squares'),
  controls: inject.service(),
  tagName: 'svg',
  attributeBindings: ['_width:width', 'height'],
  _width: computed('scale', function() {
    let scale = this.get('scale');
    return `${scale * 10}px`;
  }),
  height: computed('scale', function() {
    let scale = this.get('scale');
    return `${scale * 22}px`;
  }),
  tetrominoType: computed.alias('tetromino.type'),
  scale: computed.alias('tetromino.scale'),

  didInsertElement() {
    this.get('controls').setup();
  }
});
