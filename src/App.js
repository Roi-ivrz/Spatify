import React, { Component } from 'react';
import logo from './logo.svg';
import 'reset-css/reset.css';
import './App.css';
import queryString from 'query-string';


let defaultGreyStyle={
  color: '#696969',
  'font-family': 'Montserrat',
  'font-weight': '300',
  'fontSize': '15 px',
  'font-style': 'italic'
}

let defaultGreenStyle={
  'fontSize': '20px',
  color: '#2DD393'
}

let counterStyle={...defaultGreyStyle, 
  'fontSize': '30px', 
  width: '60%',
  'margin-top': '10px',
  'margin-bottom': '10px',
  display: 'inline-block',

}

class PlaylistCounter extends Component {
  render() {
    return(
      <div>
        <h2 style={counterStyle}>
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
        <h2 style={counterStyle}>
          {Math.floor(sumDuration / 60)} Hours {(sumDuration % 60).toFixed(1)} Minutes
        </h2>
      </div>
    );
  }
}

class Filters extends Component {
  render() {
    return(
      <div style={defaultGreyStyle}>
        <img/>
        <input type='text' onKeyUp={event => 
          this.props.onTextChange(event.target.value)}
          style={{'font-size': '15 px',
      padding: '10px'}}/>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist
    return(
      <div style={{...defaultGreyStyle, 
      width: '30%',
      padding: '10px',
      display: 'inline-block'}}>
        <img src={playlist.imageUrl} style={{width: '200px'}}/>
        <h3 style={{...defaultGreenStyle,
        'font-size': '25px',
        'font-family': 'Montserrat',
        'font-weight': '600',
        'font-style': 'normal',
        'padding-top': '6px'}}>{playlist.name}</h3>
        <ul>          
          {playlist.songs.slice(0,3).map(song => 
            <li style={{'padding-top': '6px'}}>{song.name}</li>
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
    .then(playlistData => {
      let playlists = playlistData.items
      let trackDataPromises = playlists.map(playlist => {
        let responsePromise = fetch(playlist.tracks.href, {
          headers: {'Authorization': 'Bearer ' + accessToken}
        })
        let trackDataPromise = responsePromise
          .then(response => response.json())
        return trackDataPromise
      })
      
      
      let allTracksDataPromises = 
        Promise.all(trackDataPromises)
      let playlistsPromise = allTracksDataPromises.then(tracksData => {
          tracksData.forEach((trackData, i) => {
            playlists[i].tracksData = trackData.items
            .map(item => item.track)
            .map(trackData => ({
              name: trackData.name,
              duration: trackData.duration_ms / 60000
            }))
          })
          return playlists
        })
        return playlistsPromise
    })
    .then(playlists => this.setState({
        playlists: playlists.map(item => {
        console.log(item.tracksData)
          return {
            name: item.name,
            imageUrl: item.images[0].url,
            songs: item.tracksData
          }
      })
    }))
  
  
  }
  
  

  
render() {
    let playlistRender = 
    this.state.user && 
    this.state.playlists 
    ? this.state.playlists.filter(playlist => {
      let matchPlaylist = playlist.name.toLowerCase().includes(
        this.state.filterString.toLowerCase())
      let matchSong = playlist.songs.find(song => song.name.toLowerCase()
        .includes(this.state.filterString.toLocaleLowerCase()))
      return matchPlaylist || matchSong
        }) : []
    return (
      <div className="App">
        {this.state.user ? 
        <div>
          <h1 style={{
            'font-family': 'Montserrat',
            'font-weight': '700'
          }}>
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
