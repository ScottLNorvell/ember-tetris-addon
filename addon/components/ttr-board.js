import Ember from 'ember';
import layout from '../templates/components/ttr-board';

const {
  Component,
  computed,
  inject
} = Ember;

export default Component.extend({
  layout: layout,
  classNames: ['tetris-board'],
  tetromino: inject.service(),
  played: inject.service(),
  playedSquares: computed.alias('played.squares'),
  controls: inject.service(),
  tagName: 'svg',
  attributeBindings: ['width', 'height'],
  width: computed('scale', function() {
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
