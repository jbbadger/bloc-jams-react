import React, { Component } from 'react';
import '../App.css';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      hoveredSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration,
      isPlaying: false,
      isHover: false,
      volume: .5
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
    this.audioElement.volume = this.state.volume;
  }

  componentDidMount(){
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
    },
    durationchange: e => {
      this.setState({ duration: this.audioElement.duration });
    }
  };
  this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
  this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
  }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) { this.setSong(song); }
      this.play();
    }
  }

  handleSongHover(song){
    this.setState({isHover: true});
    this.setState({hoveredSong: song});
  }

  handleSongLeave(){
    this.setState({isHover: false});
  }

  produceHoverEffect(song, index){
    if(!this.state.isPlaying && this.state.isHover && this.state.hoveredSong === song)
      {return <td><span className="ion-md-play-circle"></span></td>}
    else if (this.state.isPlaying && !this.state.isHover && this.state.currentSong === song)
      {return <td><span className="ion-md-pause"></span></td>}
    else if (this.state.isPlaying && this.state.isHover && this.state.currentSong === song)
      {return <td><span className="ion-md-pause"></span></td>}
    else {return <td id="song-number">{index+1}</td>}
  }

  handlePrevClick(){
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleNextClick(){
    const nextCurrentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const nextIndexLength = this.state.album.songs.length;
		const nextNewIndex = Math.min(nextIndexLength - 1, nextCurrentIndex + 1);
    const nextNewSong = this.state.album.songs[nextNewIndex];
    this.setSong(nextNewSong);
    this.play();
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  handleVolumeChange(e) {
    const newVolume = e.target.value;
    this.audioElement.volume = newVolume;
    this.setState({ volume: newVolume});
  }

  handleVolumeUp(e) {
    const volume = this.state.volume;
    const stepRate = 0.10;
    const newVolume = Math.min(1, (volume + stepRate));
    this.audioElement.volume = newVolume;
    this.setState({ volume: newVolume });
  }

  handleVolumeDown(e) {
    const volume = this.state.volume;
    const stepRate = 0.10;
    const newVolume = Math.max(0, (volume - stepRate));
    this.audioElement.volume = newVolume;
    this.setState({ volume: newVolume});
  }

  formatTime(time){
    if (isNaN(time)){
      return "-:--"};
    const min = parseInt(time/60);
    const sec = Math.round(time%60);
    return ((sec<10) ? `${min}:0${sec}` : `${min}:${sec}`);
  }

  render() {
    return (
      <section className="album">
        <section id="album-info">
          <img className="albCover" id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
          <div className="album-details">
            <p className="albTitle3" id="album-title">{this.state.album.title}</p>
            <p className="artist">by {this.state.album.artist}</p>
            <p className="release">{this.state.album.releaseInfo}</p>
          </div>
        </section>
        <table id="song-list">
          <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>
          <tbody>
            { this.state.album.songs.map( (song, index) =>
                <tr className="song" key={index} onClick={ () => this.handleSongClick(song)}>
                  <td id="song-number"  onMouseEnter={() => this.handleSongHover(song)} onMouseLeave={() => this.handleSongLeave(song)}><span>Track {this.produceHoverEffect(song, index)}:</span></td>
                  <td id="song-title">{song.title}</td>
							    <td id="song-duration">{this.formatTime(song.duration)}</td>
                </tr>
            )
          }
          </tbody>
        </table>
        <div className="playBar">
        <PlayerBar
          isPlaying={this.state.isPlaying}
          currentSong={this.state.currentSong}
          currentTime={this.audioElement.currentTime}
          duration={this.audioElement.duration}
          handleSongClick={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={() => this.handlePrevClick()}
          handleNextClick={() => this.handleNextClick()}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
          handleVolumeUp={(e) => this.handleVolumeUp(e)}
          handleVolumeDown={(e) => this.volumeDown(e)}
          formatTime = {(time) => this.formatTime(time)}
          />
        </div>
      </section>
    );
  }
}

export default Album;
