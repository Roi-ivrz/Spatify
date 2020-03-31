import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

let defaultGreyStyle={
  display: 'inline-block',
  color: '#696969'
}

let fakeServerData={
  user:{
    name: 'Roy',
    playlists: [
      {
        name: 'NO SLEEP',
        song: ['I fall in love too easily', 'calla lilies', 'swell', 'vibes', 'can we kiss forever?']
      },
      {
        name: '2AM beats that hit the feelings',
        song: ['entertainer', 'the weekend - funk wav remix', 'call out my name']
      },
      {
        name: 'Flow',
        song: ['the hills', 'rockin', 'over now']
      },
    ]
  }
}
let defaultGreenStyle={
  'font-size': '20px',
  color: '#2DD393'
}

class Aggregate extends Component {
  render() {
    return(
      <div>
        {this.props.playlists &&
        <h2 style={{...defaultGreyStyle, 'font-size': '30px', width: '30%'}}>
          {this.props.playlists.length} playlists
        </h2>}
      </div>
    );
  }
}

class Filters extends Component {
  render() {
    return(
      <div style={{'font-size': '15 px'}}>
        <img/>
        <input type='text'/>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    return(
      <div style={{...defaultGreyStyle, 'font-size': '15 px', width: '25%'}}>
        <img/>
        <h3 style={defaultGreenStyle}>Playlist Name</h3>
        <ul><li>Song1</li><li>Song2</li><li>Song3</li></ul>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super()
    this.state={serverData: {}}
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({serverData: fakeServerData});
    },800);
  }

  render() {
    return (
      <div className="App">
        {this.state.serverData.user && 
        <h1>
          {this.state.serverData.user.name}'s Playlist
        </h1>}
        <Aggregate playlists={this.state.serverData.user && 
                              this.state.serverData.user.playlists}/>
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
