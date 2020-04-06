import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import queryString from 'query-string';


let defaultGreyStyle={
  display: 'inline-block',
  color: '#696969'
}

let defaultGreenStyle={
  'fontSize': '20px',
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
        <h2 style={{...defaultGreyStyle, 'fontSize': '30px', width: '30%'}}>
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
        <h2 style={{...defaultGreyStyle, 'fontSize': '30px', width: '60%'}}>
          {((sumDuration/3600)*100.0) / 100.0} Hours/{((sumDuration/60)*100.0) / 100.0} Minutes
        </h2>
      </div>
    );
  }
}

class Filters extends Component {
  render() {
    return(
      <div style={{'fontSize': '15 px'}}>
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
      <div style={{...defaultGreyStyle, 'fontSize': '15 px', width: '30%'}}>
        <img src={playlist.imageUrl} style={{width: '160px'}}/>
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
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token
    if(!accessToken)
      return;

    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({
        user: {
          name: data.display_name
        }
    }))

    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({
        playlists: data.items.map(item => {
        console.log(data.items)
          return {
            name: item.name,
            imageUrl: item.images[0].url,
            songs: []
          }
        })
    }))

  }

  
render() {
    let playlistRender = 
    this.state.user && 
    this.state.playlists 
    ? this.state.playlists.filter(playlist =>
      playlist.name.toLowerCase().includes(this.state.filterString.toLowerCase())) 
      : []
    return (
      <div className="App">
        {this.state.user ? 
        <div>
          <h1>
            {this.state.user.name}'s Playlists
          </h1>

          <PlaylistCounter playlists={playlistRender}/>
          <PlaylistHour playlists={playlistRender}/>
          
          <Filters onTextChange={text => 
            this.setState({filterString: text})
          }/>
          {playlistRender.map(playlist => 
            <Playlist playlist={playlist} />
          )}

        </div>: <button onClick={() => {
          window.location=window.location.href.includes('localhost') 
            ? 'http://localhost:8888/login'
            : 'https://spatifyv2-backend.herokuapp.com/login'
        }}
          style={{padding: '20px', 'fontSize': '50px', 'marginTop': '20px'}}>
          Spotify Sign in</button>
        }
      </div>
    );
  }
}


export default App;
