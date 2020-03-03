import React, { Fragment }  from 'react'
import Menu from '../common/menu'
import Booking from '../common/booking'
import  './css.css'
function Hook () {
  const backgr = require('../../static/images/home_banner.jpg')
      return (
          <Fragment>
            <div className="wrap-header"  style={{backgroundImage: `url('${backgr}')`}}>
              
              <Menu/>
              <Booking/>
            </div>

          </Fragment>
      )
  
  }
  export default Hook