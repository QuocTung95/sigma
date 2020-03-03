import { combineReducers } from 'redux'
import cardReducer from './card/cardReducer'

const rootReducer = combineReducers({
  cardState: cardReducer
})

export default rootReducer
