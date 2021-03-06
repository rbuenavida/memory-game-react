import React, { Component } from 'react';
import Card from './Card'

import css from './GameBoard.css';

const GameBoard = (props) => {
  let cards = props.cards.map((card, idx) => {
    return <Card 
      position={idx} 
      key={idx} 
      flip={card.flipped} 
      onClick={props.onCardClicked} 
      frontImgSrc={card.imageSrc} 
      backImgSrc="/public/img/cards/back.png" />
  });

  return <div>{ cards }</div>  
}

export default GameBoard;