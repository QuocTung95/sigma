import { ON_CLICK_OUTSIDE, SEARCH_PLACE_SUCCESS, SEARCH_PLACE_ERROR, 
  ON_SHOW_SUGGESTION, ON_FETCH_PLACES, ON_FOCUS_INPUT, ON_CHOOSE_PLACE } from '../contants'

  const initialState = {
    showSuggestions: false,
    loading: false,
    searchText: '',
    places: []
  }
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case ON_SHOW_SUGGESTION:
        return{
          ...state,
          showSuggestions: true,
          searchText: action.searchText
        }
      case ON_FETCH_PLACES:
        return{
          ...state,
          loading: true
        }
      case SEARCH_PLACE_SUCCESS:
        return{
          ...state,
          places: action.places,
          loading: false
        }
        
      case SEARCH_PLACE_ERROR:
        return{
          ...state,
          places: action.places,
          loading: false
        }
      case ON_CLICK_OUTSIDE:
        return{
          ...state,
          showSuggestions: false
        }
      case ON_FOCUS_INPUT:
        return{
          ...state,
          showSuggestions: true
        }
      case ON_CHOOSE_PLACE:
        return{
          ...state,
          showSuggestions: false,
          searchText: action.name
        }

      default: return state
    }
  }
  
  
  
  export default reducer
  