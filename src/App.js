import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Aggregate extends Component {
  render() {
    return(
      <div>
        <h2 style = {{'font-size': '30px', display: 'inline-block', color: '#696969'}}> Numbered text</h2>
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
      <div  style = {{'font-size': '15 px', color: '#696969', width: '25%', display: 'inline-block'}}>
        <img/>
        <h3>Playlist Name</h3>
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
