import { combineReducers } from 'redux'
import bookingReducer from './reducer/'

const rootReducer = combineReducers({
    bookingReducer: bookingReducer
})

export default rootReducer
