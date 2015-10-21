import Ember from 'ember';

const { merge } = Ember;

function defaultAttrs() {
  return {
    box: [3,3],
    origin: 'center',
    rotationOrigin: [1,1],
    rotations: 4,
    nextCenter: [1, 1.5]
  };
}

export default {
  t: merge(defaultAttrs(), {
      positions: [
        [1,0,1,2],
        [0,1,1,1]
      ]
    }),
  s: merge(defaultAttrs(), {
    positions: [
      [1,2,0,1],
      [0,0,1,1]
    ],
    origin: [2,1],
    rotationOrigin: [1.5, 0.5],
    rotations: 2,
  }),
  z: merge(defaultAttrs(), {
    positions: [
      [0,1,1,2],
      [0,0,1,1]
    ],
    origin: [2,1],
    rotationOrigin: [1.5, 0.5],
    rotations: 2,
  }),
  j: merge(defaultAttrs(), {
    positions: [
      [0,0,1,2],
      [0,1,1,1]
    ],
  }),
  l: merge(defaultAttrs(), {
    positions: [
      [2,0,1,2],
      [0,1,1,1]
    ],
  }),
  i: merge(defaultAttrs(), {
    positions: [
      [0,1,2,3],
      [0,0,0,0]
    ],
    box: [4,1],
    origin: [1.5, 0.5],
    rotationOrigin: [1,0],
    rotations: 2,
    nextCenter: [0.5,2]
  }),
  o: merge(defaultAttrs(), {
    positions: [
      [0,1,0,1],
      [0,0,1,1]
    ],
    box: [2,2],
    rotationOrigin: [0.5,0.5],
    rotations: 0,
    nextCenter: [1.5,1.5]
  })
};
