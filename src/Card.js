import React from 'react';
import css from './Card.css';

const Card = (props) => {
  let classes = 'card' + ((props.flip) ? ' flipped' : '');

  // here we will need to update the class to flipped
  return <div onClick={() => props.onClick(props.position)} className={classes}>
    <img className="back" src={props.backImgSrc} />
    <img className="front" src={props.frontImgSrc} />
  </div>
}

export default Card;