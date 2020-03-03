
import {SEARCH_PLACE_SUCCESS, SEARCH_PLACE_ERROR, ON_FETCH_PLACES,  ON_SHOW_SUGGESTION, 
    ON_CLICK_OUTSIDE, ON_FOCUS_INPUT, ON_CHOOSE_PLACE} from '../contants'
var searchTimer2
// function onChangeInput (val) {
//     var self = this;
//     self.setState({ searchText: val, showSuggestions: true}, function () {
//         if(self.searchTimer2)
//             clearTimeout(self.searchTimer2);
//         actionCreator.setFilter({createdby: val.toLowerCase()});
//         //set delay time
//         self.searchTimer2 = setTimeout(function(){
//             self.setState({loading: true});
//             actionCreator.searchUser(self.state.searchText);
//         }, 300);
//     });
// }
export const searchPlace = keyword => {
    return(dispatch)=>{
        dispatch({
            type: ON_SHOW_SUGGESTION,
            searchText: keyword
        })
        if(searchTimer2)
            clearTimeout(searchTimer2);
        //set delay time
        searchTimer2 = setTimeout(function(){
            dispatch({type: ON_FETCH_PLACES})
            fetch('https://www.airbnb.com.vn/api/v2/autocompletes?country=VN&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&language=vi&locale=vi&num_results=5&user_input='+keyword+'&api_version=1.1.1&vertical_refinement=all&region=-1&options=should_show_stays')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if(!data || !data.autocomplete_terms.length) {
                    dispatch({
                        type: SEARCH_PLACE_ERROR,
                        places: []
                    })
                }
                else{
                    dispatch({
                        type: SEARCH_PLACE_SUCCESS,
                        places: data.autocomplete_terms
                    })
                }

            });
        }, 300);
        
    }
}
export const onClickOutside = () =>{
    return{
        type: ON_CLICK_OUTSIDE
    }
}
export const onFocusInput = () =>{
    return{
        type: ON_FOCUS_INPUT
    }
}
export const onChoosePlace = name =>{
    return{
        type: ON_CHOOSE_PLACE,
        name
    }
}


