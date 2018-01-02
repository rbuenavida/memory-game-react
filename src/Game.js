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
    
    this.state = {
      cards: _.fill(Array(this.imageLinks.length), CARD_NOT_FLIPPED)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let currentlyFlipped = this.findIndexByStatus(this.state.cards, CARD_FLIPPED_WAITING)
    
    if (currentlyFlipped.length === 2) {
      this.unflipCards(currentlyFlipped, 1500)
    }
  }

  findIndexByStatus(cards, status) {
    return _.reduce(cards, (result, val, idx) => {
      if (val === status) result.push(idx)
      return result
    }, [])
  }

  updateStatusByIndex(source, indexes, status) {
    return source.map((val, index) => (indexes.indexOf(index) >= 0) ? status : val)
  }

  cardsMatch(index, indexes) {
    const link = this.imageLinks[index] // get link
    const vals = _.map(indexes, (val) => _.nth(this.imageLinks, val))
    return (vals.indexOf(link) >= 0)
  }

  getUpdateCardsFn(indexesToUpdate, status) {
    const fn = (prevState) => {
      let cards = this.updateStatusByIndex(prevState.cards, indexesToUpdate, status)
      return { cards: cards }
    }
    return fn
  }

  unflipCards(indexes, timeout) {
    const fn = this.getUpdateCardsFn(indexes, CARD_NOT_FLIPPED)
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
    const previouslyFlipped = this.findIndexByStatus(this.state.cards, CARD_FLIPPED_WAITING)

    let indexesToUpdate = [indexClicked]
    let statusToUpdate = CARD_FLIPPED_WAITING

    if (clickedCardState > CARD_NOT_FLIPPED || previouslyFlipped.length === 2) return

    if (this.cardsMatch(indexClicked, previouslyFlipped)) {
      indexesToUpdate = _.concat(indexesToUpdate, previouslyFlipped)
      statusToUpdate = CARD_FLIPPED
    } 
    
    this.setState(this.getUpdateCardsFn(indexesToUpdate, statusToUpdate))
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