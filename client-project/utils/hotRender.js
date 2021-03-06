import React from 'react'
import ReactDOM from 'react-dom'
import env from './env'
import registerServiceWorker from './registerServiceWorker';



function hotRender(App, theId='root'){
  if (env.dev) {
    const { hot } = require('react-hot-loader')
    const AppHot = hot(module)(App)
    window.onload = function(){
      ReactDOM.render(<AppHot />, document.getElementById(theId))
    }
  } else {
    window.onload = function(){
      ReactDOM.render(<App />, document.getElementById(theId))
    }
  }
}

registerServiceWorker();

export default hotRender