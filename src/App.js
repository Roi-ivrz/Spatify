import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

let defaultGreyStyle = {
  display: 'inline-block',
  color: '#696969'
}

let defaultGreenStyle = {
  'font-size': '25px',
  color: '#2DD393'
}
class Aggregate extends Component {
  render() {
    return(
      <div>
        <h2 style = {{...defaultGreyStyle, 'font-size': '30px', width: '30%'}}> Numbered text</h2>
      </div>
    );
  }
}

class Filters extends Component {
  render() {
    return(
      <div style = {{'font-size': '15 px'}}>
        <img/>
        <input type = 'text'/>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    return(
      <div  style = {{...defaultGreyStyle, 'font-size': '15 px', width: '25%'}}>
        <img/>
        <h3 style = {{defaultGreenStyle}}>Playlist Name</h3>
        <ul><li>Song1</li><li>Song2</li><li>Song3</li></ul>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Title</h1>
        <Aggregate/>
        <Aggregate/>
        <Filters/>
        <Playlist/>
        <Playlist/>
        <Playlist/>
        <Playlist/>
      </div>
    );
  }
}


export default App;
