import React from 'react';
import ReactDOM from 'react-dom';
// import { hotRender } from './utils';

class App extends React.Component {
  render() {
    return <div >
      <div>Hello React</div>
      {/* <div style={{
        backgroundImage: 'url(assets/img/a.png)',
        backgroundSize: 'contain',
        width: 100, height: 100
      }} ></div> */}
    </div>
  }
}

// hotRender(App);
ReactDOM.render(<App />, document.getElementById('root'));