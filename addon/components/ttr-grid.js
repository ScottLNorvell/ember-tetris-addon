import Ember from 'ember';
import layout from '../templates/components/ttr-grid';

const {
  Component,
  computed,
  inject
} = Ember;

const [
  xLines,
  yLines
] = [10,22];

export default Component.extend({
  layout: layout,
  tagName: 'g',
  tetromino: inject.service(),
  scale: computed.reads('tetromino.scale'),
  yPositions: computed('scale', function() {
    let scale = this.get('scale');
    let limit = scale * yLines;
    let positions = [];
    for (let i = scale; i < limit; i+=scale) {
      positions.push(i);
    }
    return positions;
  }),
  xPositions: computed('scale', function() {
    let scale = this.get('scale');
    let limit = scale * xLines;
    let positions = [];
    for (let i = scale; i < limit; i+=scale) {
      positions.push(i);
    }
    return positions;
  }),
});
