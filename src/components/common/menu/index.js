import React  from 'react'
import  './css.css'

const menuItems = [
    {
        icon: <svg viewBox="0 0 12 12" width="0.8571428571428571em" height="0.8571428571428571em"><path d="M3.48 3.5c.17-.85.43-1.6.75-2.18A5.02 5.02 0 001.67 3.5zm1.03 0h2.98C7.16 2 6.57 1 6 1S4.84 2 4.5 3.5zm4 0h1.82a5.02 5.02 0 00-2.56-2.18c.32.58.58 1.33.75 2.18zm.16 1a13.82 13.82 0 010 3h2.1a5 5 0 000-3zm-1.01 0H4.34a12.43 12.43 0 000 3h3.32a12.43 12.43 0 000-3zm-4.33 0h-2.1a5 5 0 000 3h2.1a13.82 13.82 0 010-3zm5.19 4a7.5 7.5 0 01-.75 2.18 5.02 5.02 0 002.56-2.18zm-1.03 0H4.51C4.84 10 5.43 11 6 11s1.16-1 1.5-2.5zm-4 0H1.66c.57 1 1.48 1.77 2.56 2.18a7.5 7.5 0 01-.75-2.18zM6 12A6 6 0 116 0a6 6 0 010 12z" fill="currentcolor"></path></svg>,
        name: 'Tiếng Việt (VN)'
    },
    {
        name: '$ USD'
    },
    {
        name: 'Cho thuê nhà'
    },
    {
        name: 'Tổ chức trải nghiệm'
    },
    {
        name: 'Trợ giúp'
    },
    {
        name: 'Đăng ký'
    },
    {
        name: 'Đăng nhập'
    }
]

function Hook () {

      return (
          <div className="wrap-menu">
              <ul>
                  {
                      menuItems.map(el=>{
                          return(
                              <li>
                                  <div>
                                      {
                                          el.icon && <span>{el.icon}</span>
                                      }
                                      <span className="neme-name">{el.name}</span>
                                  </div>
                              </li>
                          )
                      })
                  }
              </ul>
          </div>
  
        
      )
  
  }
  export default Hook