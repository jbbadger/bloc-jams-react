import React, { Component } from 'react';
import albumData from './../data/albums';


class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      isPlaying: false
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
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

  handleMouseEnter(song){
    this.setState({hoveredSong: song});
    console.log('The hovered song is ');
    console.log(this.state.hoveredSong);
  }

  handleMouseLeave(){
    this.setState({hoveredSong: null});
  }

  determineIcon(song){
    if(this.state.hoveredSong === song && this.state.currentSong === song && this.state.isPlaying === true){
      return <span className='ion-md-pause'></span>
    } else if(this.state.isPlaying === false && this.state.hoveredSong === song){
      return <span className='ion-md-play-circle'></span>
    }
  }
  render() {
    return (
      <section className="album">
        <section id="album-info">
          <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release=info">{this.state.album.releaseInfo}</div>
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
                <tr className="song" key={index} onMouseEnter={() => this.handleMouseEnter(song)} onMouseLeave={() => this.handleMouseLeave()} onClick={() => this.handleSongClick(song)}>
                  <td>Title: {song.title}</td>
                  <td>{this.determineIcon(song)}</td>
                  <td>Track: {index + 1}</td>
                  <td>Duration: {song.duration} secs</td>
                </tr>
            )
          }
          </tbody>
        </table>
      </section>
    );
  }
}

export default Album;
