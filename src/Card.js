import React from 'react';
import css from './Card.css';

const Card = ({onClick, position, flip, backImgSrc, frontImgSrc}) => 
  <div onClick={() => onClick(position)} className={'card' + ((flip) ? ' flipped' : '')}>
    <img className="back" src={backImgSrc} />
    <img className="front" src={frontImgSrc} />
  </div>

export default Card;