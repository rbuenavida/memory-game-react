import React, { Component } from 'react';
import GameBoard from './GameBoard'
import _ from 'lodash';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flippedCardIds: [],
      cards: []
    }

    // create a range of number twice
    let nums = [].concat(_.range(1, 5), _.range(1, 5));

    // shuffle the array
    var shuffledNums = _.shuffle(nums);

    console.log(shuffledNums)

    shuffledNums.forEach((num) => {
      this.state.cards.push({
        num: num,
        image: num + '.png',
        flipped: false
      })
    })
  }

  // if two cards are flipped over, check if they match
  onCardClicked(index) {
    let cardClicked = _.clone(this.state.cards[index]);
    let flippedCardIds = _.clone(this.state.flippedCardIds);
    let cardsMatched = false;

    if (cardClicked.flipped || (flippedCardIds.length === 2)) return;

    flippedCardIds.push(index);
    
    let newState = _.extend({}, this.state, { flippedCardIds: flippedCardIds })
    newState.cards[index].flipped = true;

    if (flippedCardIds.length === 2) {
      cardsMatched = (this.state.cards[flippedCardIds[0]].num === this.state.cards[flippedCardIds[1]].num)
      newState.flippedCardIds = (cardsMatched) ? [] : flippedCardIds;
    }

    this.setState(newState);
    
    if (flippedCardIds.length === 2 && !cardsMatched) {
      setTimeout(() => {
        this.setState(this.resetPair(_.extend({}, this.state), flippedCardIds));
      }, 1500)
    }
  }

  resetPair(state, cardIds) {
    if (cardIds.length > 1) {
      state.flippedCardIds = [];
      cardIds.forEach((id) => { 
        state.cards[id].flipped = false;
      })
    }
    return state;
  }

  /*
  unflipCards(cards) {
    return _.map(cards, (card) =>  {
      return _.extend({}, card, { flipped: false })
    })
  }
  */

  render() {
    return <GameBoard 
      onCardClicked={this.onCardClicked.bind(this)} 
      cards={this.state.cards} />
  }
}

export default Game;