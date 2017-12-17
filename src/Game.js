import React, { Component } from 'react';
import GameBoard from './GameBoard'
import _ from 'lodash';

const LEVEL_EASY = 4;
const LEVEL_HARD = 8;

const CARD_NOT_FLIPPED = 0
const CARD_FLIPPED = 1
const CARD_FLIPPED_PENDING = 2

const CARD_KEY_PREFIX = 'card'

class Game extends Component {
  constructor(props) {
    super(props);

    // randomly select images
    let images = _.shuffle(props.images).splice(LEVEL_EASY, props.images.length - LEVEL_EASY);
    
    // duplicate and shuffle
    this.imageLinks = _.shuffle([].concat(images, images));
    
    // get matching indexes
    this.matchingIndexes = _.map(this.imageLinks, (val1, index1) => { 
      return _.findIndex(this.imageLinks, (val2, index2) => { 
        return (val1 === val2 && index1 !== index2) 
      }) 
    })
    
    // set state with card defaults
    this.state = this.cardStatus(this.imageLinks, CARD_NOT_FLIPPED);
  }

  cardKeyName(index) {
    return [CARD_KEY_PREFIX, index].join("")
  }
  
  cardStatus(indexes, status) {
    return _.reduce(indexes, (result, val, key) => {
      result[this.cardKeyName(val)] = status;
      return result
    }, {});
  }

  // if two cards are flipped over, check if they match
  onCardClicked(index) {
    let kn = this.cardKeyName
    
    // do cards match
    const cardsMatched = (this.state[kn(this.matchingIndexes[index])] === CARD_FLIPPED_PENDING);
    
    // which cards are flipped pending
    let cardsFlippedPending = _.filter(this.matchingIndexes, (val, idx) => {
      return (this.state[kn(val)] === CARD_FLIPPED_PENDING)
    })

    if (this.state[kn(index)] > 0 || (cardsFlippedPending.length === 2)) return;
    
    // if previouly card selected matches
    if (cardsMatched) {
      this.setState(this.cardStatus([index, this.matchingIndexes[index]], CARD_FLIPPED))
    } else {
      this.setState(this.cardStatus([index], CARD_FLIPPED_PENDING))
      cardsFlippedPending.push(index);
    }
    
    // if we have unmatched cards
    if (cardsFlippedPending.length === 2 && !cardsMatched) {
      setTimeout(() => {
        this.setState(this.cardStatus(cardsFlippedPending, CARD_NOT_FLIPPED))
      }, 1500)
    }
  }

  render() {
    const cards = this.imageLinks.map((link, idx) => {
      return {
        imageSrc: link,
        flipped: ([CARD_FLIPPED, CARD_FLIPPED_PENDING].indexOf(this.state[this.cardKeyName(idx)]) >= 0) 
      }
    })

    return <GameBoard 
      onCardClicked={this.onCardClicked.bind(this)} 
      cards={cards} />
  }
}

export default Game;