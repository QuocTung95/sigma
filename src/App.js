import React, {Fragment} from 'react'
import Header from './components/header'
import NewInHome from './components/newsInHome/index'
import IntroDuce from './components/introduce/'



function App () {
  return (
    <Fragment>
      <div className='App'>
        <Header/>
        <div className="main-content">
          <NewInHome />
          <IntroDuce/>
        </div>
      </div>
    </Fragment>
  )
}

export default App
