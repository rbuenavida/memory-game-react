import React from 'react';
import ReactDOM from 'react-dom';

import Game from './Game.js';

import css from './style.css';

// our 8 monster images
const MONSTER_IMAGES = _.range(1, 9).map((n) => {
  return ['img/cards/', n, '.png'].join('')
})

const NewComponent = (props) => {
  return <Game images={MONSTER_IMAGES} />
}

ReactDOM.render(
  <NewComponent />,
  document.getElementById('root')
);