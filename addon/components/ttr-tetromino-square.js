import Ember from 'ember';

const {
  Component,
  computed
} = Ember;

export default Component.extend({
  tagName: 'rect',
  attributeBindings: ['x', 'y', 'width', 'height'],
  classNameBindings: ['squareClass'],
  squareClass: computed('type', function() {
    let type = this.get('type');
    return `ttr-tetromino__square--${type}`;
  }),
  x: computed('pos.x', 'scale', function() {
    let scale = this.get('scale');
    return `${this.get('pos.x') * scale}px`;
  }),
  y: computed('pos.y', 'scale', function() {
    let scale = this.get('scale');
    return `${this.get('pos.y') * scale}px`;
  }),
  width: computed('scale', function() { return `${this.get('scale')}px`; }),
  height: computed('scale', function() { return `${this.get('scale')}px`; })
});
