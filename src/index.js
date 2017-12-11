import React from 'react';
import ReactDOM from 'react-dom';

import Game from './Game.js';

import css from './style.css';

const NewComponent = (props) => {
  return <Game />
}

ReactDOM.render(
  <NewComponent />,
  document.getElementById('root')
);