import React, { Component } from 'react'
import GameBoard from './GameBoard'
import _ from 'lodash'

const LEVEL_EASY = 4;
const LEVEL_HARD = 8;

const CARD_NOT_FLIPPED = 0
const CARD_FLIPPED = 1
const CARD_FLIPPED_WAITING = 2

class Game extends Component {
  constructor(props) {
    super(props);

    // randomly select images
    let images = _.shuffle(props.images).splice(LEVEL_EASY, props.images.length - LEVEL_EASY);
    
    // duplicate and shuffle
    this.imageLinks = _.shuffle([].concat(images, images));
    
    // get matching indexes, not part of state since it doesn't change
    this.matchingIndexes = _.map(this.imageLinks, (val1, index1) => { 
      return _.findIndex(this.imageLinks, (val2, index2) => { 
        return (val1 === val2 && index1 !== index2) 
      }) 
    })
    
    this.state = {
      cards: _.fill(Array(this.matchingIndexes.length), CARD_NOT_FLIPPED)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let currentlyFlipped = this.findCardsByStatus(this.state.cards, CARD_FLIPPED_WAITING)
    
    if (currentlyFlipped.length === 2) {
      this.unflipCards(currentlyFlipped, 1500)
    }
  }

  findCardsByStatus(cards, status) {
    return _.reduce(cards, (result, val, idx) => {
      if (val === status) result.push(idx)
      return result
    }, [])
  }

  cardsMatch(index, indexes) {
    const vals = _.map(indexes, (val) => { 
      return _.nth(this.matchingIndexes, val) 
    })
    return (vals.indexOf(index) >= 0);
  }

  unflipCards(indexes, timeout) {
    // which cards are already flipped and waiting
    const fn = (prevState) => {
      let cards = [...prevState.cards]
      _.each(indexes, function(index) {
        cards[index] = CARD_NOT_FLIPPED
      })
      return { cards: cards }
    }

    if (timeout) {
      setTimeout(() => { this.setState(fn) }, timeout);
    } else {
      this.setState(fn)
    }
  }

  // if two cards are flipped over, check if they match
  onCardClicked(indexClicked) {
    const clickedCardState = this.state.cards[indexClicked]
    // which cards are already flipped and waiting
    const previouslyFlipped = this.findCardsByStatus(this.state.cards, CARD_FLIPPED_WAITING)

    if (clickedCardState > CARD_NOT_FLIPPED || previouslyFlipped.length === 2) return

    // do cards match
    const isCardsMatched = this.cardsMatch(indexClicked, previouslyFlipped)
    
    this.setState((prevState) => {
      let cards = [...prevState.cards]
      if (isCardsMatched) {
        cards[indexClicked] = CARD_FLIPPED
        cards[previouslyFlipped] = CARD_FLIPPED
      } else {
        cards[indexClicked] = CARD_FLIPPED_WAITING
      }
      return { cards: cards }
    })
  }

  render() {
    const cards = this.imageLinks.map((link, idx) => {
      return {
        imageSrc: link,
        flipped: ([CARD_FLIPPED, CARD_FLIPPED_WAITING].indexOf(this.state.cards[idx]) >= 0) 
      }
    })

    return <GameBoard 
      onCardClicked={this.onCardClicked.bind(this)} 
      cards={cards} />
  }
}

export default Game;