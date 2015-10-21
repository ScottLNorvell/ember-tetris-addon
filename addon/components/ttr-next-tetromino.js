import Ember from 'ember';
import layout from '../templates/components/ttr-next-tetromino';
import tetrominos from '../utils/tetrominos';

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

  style: computed('scale', 'type', function() {
    let scale = this.get('scale');
    let type = this.get('type');
    let center = tetrominos[type].nextCenter;
    let style = `transform: translate(${scale * center[0]}px, ${scale * center[1]}px);`;
    return Ember.String.htmlSafe(style);
  }),

  tetromino: inject.service(),
  bag: inject.service(),

  scale: computed.reads('tetromino.scale'),

  type: computed('bag.queue.lastObject', function() {
    return this.get('bag.queue.lastObject');
  }),

  positions: computed('type', function() {
    // TODO: copied code from tetromino service (make a mixin or other service?)
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
});
