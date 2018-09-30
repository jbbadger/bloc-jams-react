import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import albumData from './../data/albums';

class Library extends Component {
  constructor(props) {
    super(props);
    this.state = { albums: albumData };
  }

  render() {
    return(
      <section className='library'>
        {
          this.state.albums.map( (album, index) =>
            <Link to={`/album/${album.slug}`} key={index} >
              <img className='albumImg' src={album.albumCover} alt={album.title} />
              <div className="albTitle">
              <div className="albTitle2">{album.title}</div>
              <div className="albArtist">{album.artist}</div>
              <div className="albSongs">{album.songs.length} songs</div>
              </div>
            </Link>
          )
        }
      </section>
    );
  }
}

export default Library;
