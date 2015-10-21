import Ember from 'ember';
import layout from '../templates/components/ttr-up-next';

const {
  Component,
  computed,
  inject
} = Ember;

export default Component.extend({
  layout: layout,
  tagName: 'svg',
  classNames: ['ttr-up-next'],
  attributeBindings: ['width', 'height'],
  tetromino: inject.service(),
  scale: computed.alias('tetromino.scale'),

  width: computed('scale', function() {
    let scale = this.get('scale');
    return `${scale * 5}px`;
  }),
  height: computed('scale', function() {
    let scale = this.get('scale');
    return `${scale * 5}px`;
  }),
});
