import Ember from 'ember';

const {
  Service,
  computed
} = Ember;

const baseScores = [40, 100, 300, 1200];

export default Service.extend({
  score: 0,
  lines: 0,
  level: computed('lines', function() {
    let lines = this.get('lines');
    if (lines) {
      return Math.floor(lines/5);
    } else {
      return 0;
    }
  }),
  addScore(lines) {
    let linesCleared = lines.length;
    let level = this.get('level');
    let score = baseScores[linesCleared - 1] * (level + 1);
    this.incrementProperty('score', score);
    this.incrementProperty('lines', linesCleared);
  },
  resetScore() {
    // TODO: compute high score here?
    this.setProperties({
      score: 0,
      lines: 0
    });
  }
});
