import React  from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { searchPlace, onClickOutside, onFocusInput, onChoosePlace} from '../booking/actions'
import { Provider } from 'react-redux'
import store from './store/'
import './style/index.css'
import DatePicker from '../../../ultils/date-picker'
import SuggestPanel from '../../../ultils/suggestpanel/suggestpanel.jsx'
import Input from '../../../ultils/input'


function Booking(){
    const state = useSelector(state => state)
    const dispatch = useDispatch()
    const listPlaces =  state.bookingReducer.places
    const showSuggestions =  state.bookingReducer.showSuggestions
    const loading =  state.bookingReducer.loading
    const searchText =  state.bookingReducer.searchText
    return(
        <div className="wrap-booking">
            <div className="content">
                <div className="header">Đặt những chỗ ở độc đáo và những điều nên trải nghiệm.</div>
                <div className="filter">
                    <div className="place">
                    <label>Địa điểm</label>
                    <SuggestPanel 
                              className=""
                              itemClassName="suggest-account"
                              suggestions={listPlaces.map(function(item) {
                                  return {
                                      logo: '',
                                      name: item.display_name || '',
                                      id: item.placeId,
                                  };
                              })}
                              showSuggestions={showSuggestions}
                              onClickOutside={function() {
                                  if (showSuggestions == true) {
                                      dispatch(onClickOutside())
                                  }
                              }}
                              isLoading={loading}
                              onChoose={function(item) {
                                  dispatch(onChoosePlace(item.name))
                              }}
                              panelMarginTop={210}
                              panelMarginBottom={105}
                >
                    <Input
                        value={searchText}
                        onChange={function (val) {
                            dispatch(searchPlace(val))

                        }}
                        onFocus={function() {
                            if (searchText) {
                                dispatch(onFocusInput())
                            }
                        }}
                        placeholder="Bất kỳ đâu"
                    />
                </SuggestPanel>
                    </div>
                    <div className="date-picker">
                        <div className="from-date">
                            <label>Nhận phòng</label>
                            <DatePicker showTime={false} placeholder='Ngày nhận phòng'/>
                        </div>
                        <div className="to-date">
                            <label>Trả phòng</label>
                            <DatePicker showTime={false} placeholder='Ngày trả phòng'/>
                        </div>
                    </div>
                    <div className="submit">
                        <span>Tìm kiếm</span>
                    </div>

                </div>
            </div>
        </div>
    )
}






function Hook () {

    // const isTimeOut = state.cardState.isTimeOut
    // const count = state.cardState.count
    // const allPairs = state.cardState.allPairs
    // const time = state.cardState.time
    // const isStart = state.cardState.isStart
    // const dispatch = useDispatch()
      return (
          <Provider store={store}>
                <Booking/>
          </Provider>
          
      )
  
  }
  export default Hook