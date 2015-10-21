import Ember from 'ember';

const {
  Component,
  computed,
  inject
} = Ember;

export default Component.extend({
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
