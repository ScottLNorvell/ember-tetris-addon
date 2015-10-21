import Ember from 'ember';
import layout from '../templates/components/ttr-tetromino';

const {
  Component,
  computed,
  inject
} = Ember;

export default Component.extend({
  layout: layout,
  classNames: ['ttr-tetromino'],
  tagName: 'g',
  attributeBindings: ['style'],

  tetromino: inject.service(),

  box: computed.reads('tetromino.box'),
  scale: computed.reads('tetromino.scale'),
  positions: computed.reads('tetromino.positions'),
  type: computed.reads('tetromino.type'),
  rotation: computed.reads('tetromino.rotation'),
  origin: computed.reads('tetromino.origin'),
  xPos: computed.reads('tetromino.xPos'),
  yPos: computed.reads('tetromino.yPos'),

  style: computed('xPos', 'yPos', 'rotation', 'origin', 'scale', function() {
    let xPos = this.get('xPos');
    let yPos = this.get('yPos');
    let rotation = this.get('rotation');
    let origin = this.get('origin');
    let scale = this.get('scale');
    if (typeof origin !== 'string') {
      origin = `${origin[0] * scale}px ${origin[1] * scale}px`;
    }
    let style = `transform: translate(${xPos * scale}px, ${yPos * scale}px) rotate(${rotation * 90}deg); transform-origin: ${origin}`;
    return Ember.String.htmlSafe(style);
  })
});
