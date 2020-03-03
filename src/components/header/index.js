import React, { Fragment }  from 'react'
import Menu from '../common/menu'
import Booking from '../common/booking'
import  './css.css'
function Hook () {
      return (
          <Fragment>
            <div className="wrap-header">
              
              <Menu/>
              <Booking/>
            </div>

          </Fragment>
      )
  
  }
  export default Hook