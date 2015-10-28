# Ember Tetris

This is the last ember addon you will ever need! Ember Tetris allows you to insert a tetris game **anywhere** in your app.

### Possible use cases:
- Offline states
- Error Pages
- Loading Pages
- Easter Eggs
- and so Much MORE...

## Demo
You can check out a live demo [here](http://scottlnorvell.com/ember-tetris-addon/).

## Usage
Inside your app's folder run `ember install ember-tetris`.

Wherever you want a tetris game:
```handlebars
{{!-- error.hbs --}}
<h2>We're sorry something went wrong!</h2>
<p>You could try refreshing or play this game while you wait...</p>
{{ttr-game width=300}}

```

In this example, `width` refers to the width in pixels of the tetris board. A `width` of `300` would give you a tetris board that is `300px` wide and `660px` high (based on the 10x22 grid).

## Components
#### `{{ttr-game}}`
Drop an entire tetris game complete with a scoreboard, play/pause buttons, and instructions. `ttr-game` takes the following attribute:
- `width`: _optional, integer, default: 300_: The intended width of the tetris board. `width` gets divided by 10 and passed around as a `scale` property that determines the positions for just about everything in the game. For this reason it is recommended that you provide a number that neatly divides by 10 (300, 250, etc) to prevent positioning discrepancies caused by rounding errors. `width` is actually passed directly to `ttr-board` which is responsible for setting the overally `scale`. NOTE: If you use anything but the default width, you will likely need to override the `.ttr-dashboard` style to position things correctly. (see [Styling](#styling) for extending styles).

#### `{{ttr-board}}`
Use `ttr-board` if you are building your own game piecemeal. `ttr-board` also takes an optional `width` property (see [above](#ttr-game)).

#### `{{ttr-grid}}`
Part of the `ttr-board` template. It is not recommended that you extend/overwrite this. To hide the grid, overwrite `.ttr-grid-line` in your stylesheet (see [Styling](#styling)).

#### `{{ttr-tetromino}}`
Also part of the `ttr-board`, this is the actual tetromino that you can move around with the [controls](#controls).

#### `{{ttr-up-next}}` and `{{ttr-next-tetromino}}`
These make up the preview 'next' tetromino in the game.

## Services
Ember Tetris uses services to manage game state. It is designed to be highly extendable so that you can, say, build your own scoreboard or even customize the controls for a mobile experience.

#### SCORING 
`scoring` handles all computation of scoring for each tetris game. The scoring api consists of the following:

- `score`: The score of the current game.
- `lines`: The number of lines cleared for the current game.
- `level`: The current level based on lines cleared.

Usage:
```javascript
// components/my-custom-scoreboard.js
export default Ember.Component.extend({
  scoring: Ember.inject.service()
})
```
and in the template:
```handlebars
{{!-- templates/components/my-custom-scoreboard.hbs --}}
<h1>HERE IS YOUR SCORE: {{scoring.score}}</h1>
```

#### CONTROLS
`controls` handles all movement of the primary tetromino within the game. It can be left as-is to use the default controls (arrow keys and spacebar) or extended to customize the controls.

To customize, extend controls like this:
```javascript
// app/services/controls.js
import Controls from 'ember-tetris/services/controls';

export default Controls.extend({
  setupControls() {
    // default functionality is to setup keyboard listeners like this:
    // Ember.$(document).on('keydown', this._handleKeydown.bind(this));
    // however, you could do whatever you want!
  }
})
```

Keyboard controls come from the private utility shown below. (Have a look at `Controls#_handleKeydown` to see how this is used.)

```javascript
// addon/utils/key-map.js
export default {
  playing: {
    40: 'downRect', // down arrow
    37: 'leftRect', // up arrow
    39: 'rightRect', // right arrow
    67: 'changeTetromino', // 'c' key
    38: 'rotateTetromino', // up arrow
    32: 'playTetromino', // space bar
    80: 'pauseGame' // 'p' key
  },
  paused: {
    80: 'pauseGame' // 'p' key
  }
};
```

Any extension of `controls` should trigger the following api:

##### Required:
- `downRect`, `leftRect`, and `rightRect`: Moves the tetromino one tick "down", "left", and "right" respectively.
- `rotateTetromino`: Rotates the tetromino clockwise. NOTE: counter-clockwise rotation is not implemented at this time.

##### Optional:
- `playTetromino`: Causes the tetromino to fall to a "played" position immediately.
- `pauseGame`: Toggles game pause/play state. Please note that the default implementation of controls handles disabling of other controls while the game is paused. Any custom implementation will need to key off of `Controls#paused` to disable controls. Refer to the example below:
```javascript
// app/components/my-custom-left-arrow.js
export default Ember.Component.extend({
  controls: Ember.inject.service(),
  actions: {
    goLeft() {
      let controls = this.get('controls');
      if (!controls.get('paused')) {
        controls.leftRect();
      }
    }
  }
});
```
- `changeTetromino`: Cycles tetromino through available types. (This is a little easter egg I built while developing ember-tetris and decided to leave in.)
- `resetBoard`: Clears everything and starts a new game.

##### Hooks:
Ember Tetris comes with some hooks that get called at key points in the game.
- `onGameOver`: This is called on game over (when no other pieces can be played). The default implementation is to open a confirm dialog, but I'm sure you can come up with something better.
- More hooks to come in future versions!

## Styling
Ember Tetris ships with some basic styles that allow you to get up and running quickly. These styles will show up in vendor.css in your app's index file. However, customizing Ember Tetris is designed to be easy.

#### Customizing
Each tetromino has a "type" property which corresponds to the letter of the alphabet it most resembles. I.E. the long skinny piece is called `'i'`, the square is called `'o'` and so on.

Each individual square in a tetromino has a class property of `'.ttr-tetromino__square--<type>'`. So for example, the `'i'` tetromino is styled like this:

```css
/* vendor/app.css */
.ttr-tetromino__square--i {
  stroke-width: 3;
  stroke: #00cccc; /* or darken(cyan, 10) from SASS */
  fill: cyan; 
}
```

Please refer to [vendor/app.css](https://github.com/ScottLNorvell/ember-tetris-addon/blob/master/vendor/app.css) for additional styles.






