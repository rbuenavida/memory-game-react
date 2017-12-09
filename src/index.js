import React from 'react';
import ReactDOM from 'react-dom';

import css from './style.css';

function NewComponent(props) {
  return <div className="card">
    This is a card
  </div>
}

ReactDOM.render(
  <NewComponent />,
  document.getElementById('root')
);