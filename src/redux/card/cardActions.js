
import {CLICK_CARD, SELECT_LEVEL, COMPARE_CARD, TIME_OUT, PLAY_AGAIN} from './cardTypes'

export const clickCard = card => {
  return {
    type: CLICK_CARD,
    card: card
  }
}
export const compareCard = cardCompare =>{
  return{
    type: COMPARE_CARD,
    cardCompare
  }
}

export const selectLevel = level => {
  timeOut()
  return {
    type: SELECT_LEVEL,
    level
  }
}

export const timeOut = () => {
    return{
      type: TIME_OUT
    }

}
export const playAgain = () => {
    return{
      type: PLAY_AGAIN
    }

}


