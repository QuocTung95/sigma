import {
  CLICK_CARD, SELECT_LEVEL, COMPARE_CARD, TIME_OUT, PLAY_AGAIN
} from './cardTypes'

const initialState = {
  currentCard: null,
  cardCompare: null,
  itemOpen: 0,
  isTimeOut: false,
  time: 120,
  isStart: false,
  level: null,
  count: 0,
  allPairs: 0,
  cards: [
    { id: 0, name: '1.jpg', nameId: 'img1' },
    { id: 1, name: '1 - Copy.jpg', nameId: 'img1' },
    { id: 2, name: '2.jpg', nameId: 'img2' },
    { id: 3, name: '2 - Copy.jpg', nameId: 'img2' },
    { id: 4, name: '3.jpg', nameId: 'img3' },
    { id: 5, name: '3 - Copy.jpg', nameId: 'img3' },
    { id: 6, name: '4.jpg', nameId: 'img4' },
    { id: 7, name: '4 - Copy.jpg', nameId: 'img4' },
    { id: 8, name: '5.jpg', nameId: 'img5' },
    { id: 9, name: '5 - Copy.jpg', nameId: 'img5' },
    { id: 10, name: '6.jpg', nameId: 'img6' },
    { id: 11, name: '6 - Copy.jpg', nameId: 'img6' },
    { id: 12, name: '7.jpg', nameId: 'img7' },
    { id: 13, name: '7 - Copy.jpg', nameId: 'img7' },
    { id: 14, name: '8.jpg', nameId: 'img8' },
    { id: 15, name: '8 - Copy.jpg', nameId: 'img8' }
  ],
  extendCard: [
    { id: 16, name: '9.jpg', nameId: 'img9' },
    { id: 17, name: '9 - Copy.jpg', nameId: 'img9' },
    { id: 18, name: '10.jpg', nameId: 'img10' },
    { id: 19, name: '10 - Copy.jpg', nameId: 'img10' },
    { id: 20, name: '11.jpg', nameId: 'img11' },
    { id: 21, name: '11 - Copy.jpg', nameId: 'img11' },
    { id: 22, name: '12.jpg', nameId: 'img12' },
    { id: 23, name: '12 - Copy.jpg', nameId: 'img12' },
    { id: 24, name: '13.jpg', nameId: 'img13' },
    { id: 25, name: '13 - Copy.jpg', nameId: 'img13' },
    { id: 26, name: '14.jpg', nameId: 'img14' },
    { id: 27, name: '14 - Copy.jpg', nameId: 'img14' },
    { id: 28, name: '15.jpg', nameId: 'img15' },
    { id: 29, name: '15 - Copy.jpg', nameId: 'img15' },
    { id: 30, name: '16.jpg', nameId: 'img16' },
    { id: 31, name: '16 - Copy.jpg', nameId: 'img16' },
    { id: 32, name: '17 - Copy.jpg', nameId: 'img17' },
    { id: 33, name: '17.jpg', nameId: 'img17' },
    { id: 34, name: '18 - Copy.jpg', nameId: 'img18' },
    { id: 35, name: '18.jpg', nameId: 'img18' }
  ]
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CLICK_CARD:
      var cards = state.cards
      var currentCard = !state.currentCard ? action.card : state.currentCard
      var itemOpen = 0

      cards.forEach(el => {
        if (el.id === action.card.id) {
          el.open = true
        }
      })
      cards.forEach(el => {
        if (el.open === true) {
          itemOpen++
        }
      })
      return {
        ...state,
        cards,
        currentCard,
        itemOpen
      }

    case SELECT_LEVEL:
      var time = state.time
      var cards = state.cards
      var allPairs = state.allPairs
      var extendCard = state.extendCard
      var isStart = true
      if (action.level === 'normal') {
        time = 60
      } else if (action.level === 'hard') {
        cards = cards.concat(extendCard)
      }
      var shuffle = function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {

          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }

        return array;
      }
      allPairs = cards.length/2
      cards = shuffle(cards)
      return {
        ...state,
        level: action.level,
        time,
        cards,
        isStart,
        allPairs
      }
    case COMPARE_CARD:

      if (state.itemOpen === 2) {
        if (state.currentCard && action.cardCompare && action.cardCompare.nameId !== state.currentCard.nameId) {
          var cards = state.cards
          var currentCard = null
          currentCard = null
          cards.forEach(el => {
            delete el.open
          })
          return {
            ...state,
            cards,
            currentCard,
            itemOpen: 0
          }
        } else if (state.currentCard && action.cardCompare && action.cardCompare.nameId === state.currentCard.nameId) {
          //phần này là match
          var cards = state.cards
          var count = state.count
          cards.forEach(el => {
            if (el.nameId === action.cardCompare.nameId) {
              el.hide = true
              el.open = false
            }
          })

          currentCard = null
          itemOpen = 0
          count++

          return {
            ...state,
            cards,
            currentCard,
            itemOpen,
            count
          }
        }
      }
      break
    case TIME_OUT:
      return {
        ...state,
        isTimeOut: true
      }
    case PLAY_AGAIN:
      initialState.cards.forEach(el => {
        delete el.hide
        delete el.open
      })
      return initialState

    default: return state
  }
}



export default reducer
