import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

let defaultGreyStyle={
  display: 'inline-block',
  color: '#696969'
}

let defaultGreenStyle={
  'font-size': '20px',
  color: '#2DD393'
}

let fakeServerData={
  user:{
    name: 'Roy',
    playlists: [
      {
        name: 'NO SLEEP',
        songs: [
                {name: 'I fall in love too easily', duration: 180}, 
                {name: 'calla lilies', duration: 180}, 
                {name: 'swell', duration: 180}
              ]
      },
      {
        name: '2AM beats that hit the feelings',
        songs: [
                {name: 'entertainer', duration: 180},
                {name: 'the weekend - funk wav remix', duration: 180},
                {name: 'call out my name', duration: 180}
              ]
      },
      {
        name: 'Flow',
        songs: [
                {name: 'the hills', duration: 180},
                {name: 'rockin', duration: 180},
                {name: 'over now', duration: 180},
              ]
      },
    ]
  }
}

class PlaylistCounter extends Component {
  render() {
    return(
      <div>
        <h2 style={{...defaultGreyStyle, 'font-size': '30px', width: '30%'}}>
          {this.props.playlists.length} Playlists
        </h2>
      </div>
    );
  }
}

class PlaylistHour extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs,eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    },[])
    let sumDuration = allSongs.reduce((sum,eachSong) => {
      return sum + eachSong.duration
    }, 0)
    return(
      <div>
        <h2 style={{...defaultGreyStyle, 'font-size': '30px', width: '60%'}}>
          {((sumDuration/3600)*100.0) / 100.0} Hours/{((sumDuration/60)*100.0) / 100.0} Minutes
        </h2>
      </div>
    );
  }
}

class Filters extends Component {
  render() {
    return(
      <div style={{'font-size': '15 px'}}>
        <img/>
        <input type='text' onKeyUp={event => 
          this.props.onTextChange(event.target.value)}/>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist
    return(
      <div style={{...defaultGreyStyle, 'font-size': '15 px', width: '30%'}}>
        <img/>
        <h3 style={defaultGreenStyle}>{playlist.name}</h3>
        <ul>          
          {playlist.songs.map(song => 
            <li>{song.name}</li>
          )}
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super()
    this.state={
      serverData: {},
      filterString: ''
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({serverData: fakeServerData});
    },800);
  }

  render() {
    return (
      <div className="App">
        {this.state.serverData.user ? 
        <div>
          <h1>
            {this.state.serverData.user.name}'s Playlist
          </h1>
          <PlaylistCounter playlists={this.state.serverData.user.playlists}/>
          
          <PlaylistHour playlists={this.state.serverData.user.playlists}/>
          
          <Filters onTextChange={
            text => this.setState({filterString: text})
          }/>

          {this.state.serverData.user.playlists.filter(playlist =>
            playlist.name.toLowerCase().includes(this.state.filterString.toLowerCase())
          ).map(
            playlist => <Playlist playlist = {playlist}/>
          )}

        </div>: <h4>One Moment...</h4>
        }
      </div>
    );
  }
}


export default App;
