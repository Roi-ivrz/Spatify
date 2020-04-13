import React, { Component } from 'react';
import logo from './logo.svg';
import 'reset-css/reset.css';
import './App.css';
import queryString from 'query-string';



let defaultGreyStyle={
  color: '#696969',
  'fontFamily': 'Montserrat',
  'fontWeight': '300',
  'fontSize': '15 px',
  'fontStyle': 'italic',
  'marginop': '6px'
}

let defaultGreenStyle={
  'fontSize': '20px',
  color: '#2DD393'
}

let defaultGoldStyle={
  'fontSize': '20px',
  color: '#FCD12A'
}

let counterStyle={...defaultGreyStyle, 
  'fontSize': '30px', 
  width: '60%',
  'marginTop': '10px',
  'marginBottom': '10px',
  display: 'inline-block'
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
        <input type='text' placeholder="Search" onKeyUp={event => 
          this.props.onTextChange(event.target.value)}
          style={{'fontSize': '15 px',
      padding: '10px'}}/>
        
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist
    let playlistStyle = defaultGreenStyle
    
    if(playlist.collaborative === true) {
      playlistStyle = defaultGoldStyle
       } else {
        playlistStyle = defaultGreenStyle
      }
    return(
      <div style={{...defaultGreyStyle, 
      width: '30%',
      padding: '10px',
      display: 'inline-block'}}>
        <img src={playlist.imageUrl} style={{width: '200px'}}/>
        <h3 style={{...playlistStyle,
        'fontSize': '25px',
        'fontFamily': 'Montserrat',
        'fontWeight': '600',
        'fontStyle': 'normal',
        'paddingTop': '6px'}}>{playlist.name}</h3>
        <ul>          
          {playlist.songs.slice(0,3).map(song => 
            <li style={{'paddingTop': '6px'}}>{song.name}</li>
          )}
        </ul>
      </div>
    )
  }
}

// class TopArtists extends Component{
//   render() {
//     let topArtists = this.state.topArtists
//     console.log(this.state.user.name)
//     return (
//       <div style={defaultGreyStyle}> 
//         <h3>im gay</h3>
//       </div>
//     )
//   }
// }

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

//PERSONAL DATA
    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({
        user: {
          name: data.display_name,
          followers: data.followers.total,
          imageUrl: data.images[0].url,
          profileUri: data.uri
        }
    }))




//TOP ARTISTS
    let topArtist = []
    fetch('https://api.spotify.com/v1/me/top/artists', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => data.items.slice(0,5).map(item => {
        return topArtist.push(item.name)
      }))

    console.log(topArtist)
    console.log(typeof(topArtist[0]))





    //RECOMMENDATION
    let limit = '5'
    let genre = 'EDM'
    let market = 'US'
    let seedArtists = ''
    let top = ''


    let seedTrack = '0c6xIDDpzE81m2q797ordA'
    let minEnergy = '0.4'
    let minPopularity = '50'


    fetch('https://api.spotify.com/v1/recommendations?'
    +'limit='+limit
    +'&market='+market
    +'&seed_artists='+seedArtists
    +'&seed_genres='+genre
    +'&seed_tracks='+seedTrack
    +'&min_energy='+minEnergy
    +'&min_popularity='+minPopularity, {
      headers: {'Authorization': 'Bearer ' + accessToken}
    })
    
    .then(response => response.json())

//PLAYLISTS
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
          return {
            name: item.name,
            imageUrl: item.images[0].url,
            songs: item.tracksData,
            collaborative: item.collaborative
            
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
            'fontFamily': 'Montserrat',
            'fontWeight': '700',
            display: 'inline-block'
          }}>            {this.state.user.name}'s Playlists
          </h1>
          <button onClick={() => window.location = this.state.user.profileUri} id="close-image">
            <img src={this.state.user.imageUrl}></img>
          </button>

          <h2 style={defaultGreyStyle}>
            Followers: {this.state.user.followers}
          </h2>
        
          <PlaylistCounter playlists={playlistRender}/>
          <PlaylistHour playlists={playlistRender}/>
          
          <Filters onTextChange={text => 
            this.setState({filterString: text})
          }/>
          {playlistRender.map(playlist => 
            <Playlist playlist={playlist} />
          )}
          {/* <TopArtists/> */}

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
