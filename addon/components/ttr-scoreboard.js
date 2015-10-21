import Ember from 'ember';
import layout from '../templates/components/ttr-scoreboard';

const {
  Component,
  inject
} = Ember;

export default Component.extend({
  layout: layout,
  classNames: ['ttr-scoreboard'],
  scoring: inject.service()
});
