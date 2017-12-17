import React, { Component } from 'react';
import GameBoard from './GameBoard'
import _ from 'lodash';

const LEVEL_EASY = 4;
const LEVEL_HARD = 8;

const CARD_NOT_FLIPPED = 0
const CARD_FLIPPED = 1
const CARD_FLIPPED_PENDING = 2

class Game extends Component {
  constructor(props) {
    super(props);

    // randomly select images
    let images = _.shuffle(props.images).splice(LEVEL_EASY, props.images.length - LEVEL_EASY);
    // duplicate and shuffle
    this.imageLinks = _.shuffle([].concat(images, images));
    this.matchingIndexes = [];
    
    this.imageLinks.forEach((link1, idx1) => {
      this.imageLinks.forEach((link2, idx2) => {
        if ((link1 === link2) && (idx1 !== idx2)) {
          this.matchingIndexes.push(idx2)
        }       
      });
      
      this.state = {}
      this.state['card' + idx1] = CARD_NOT_FLIPPED;
    })

    // console.log(this.imageLinks)
    // console.log('matching indexes', this.matchingIndexes)
    // console.log(this.state)

  }

  // if two cards are flipped over, check if they match
  onCardClicked(index) {
    let cardsPendingFlipped = [];
    let cards = {}
    let cardsMatched = (this.state['card' + this.matchingIndexes[index]] === CARD_FLIPPED_PENDING);

    this.matchingIndexes.forEach((matchingIndex) => {
      if (this.state['card' + matchingIndex] == CARD_FLIPPED_PENDING) {
        cardsPendingFlipped.push(matchingIndex);
      }
    });

    if (this.state['card' + index] > 0 || (cardsPendingFlipped.length === 2)) return;
    
    // if previouly card selected matches
    if (cardsMatched) {
      cards['card' + index] = CARD_FLIPPED;
      cards['card' + this.matchingIndexes[index]] = CARD_FLIPPED
    } else {
      cards['card' + index] = CARD_FLIPPED_PENDING;
      cardsPendingFlipped.push(index);
    }
    
    this.setState(cards);
    
    if (cardsPendingFlipped.length === 2 && !cardsMatched) {
      setTimeout(() => {
        let cards = {}
        cardsPendingFlipped.forEach((num) => {
          cards['card' + num] = CARD_NOT_FLIPPED
        })
         this.setState(cards);
      }, 1500)
    }
  }

  render() {
    const cards = this.imageLinks.map((link, idx) => {
      return {
        imageSrc: link,
        flipped: (this.state['card' + idx] === 1 || this.state['card' + idx] === 2)  
      }
    })

    return <GameBoard 
      onCardClicked={this.onCardClicked.bind(this)} 
      cards={cards} />
  }
}

export default Game;