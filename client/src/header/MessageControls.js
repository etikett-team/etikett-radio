import React, { useState, useEffect, useContext } from 'react'
import { Context } from "../Context";
import moment from "moment";
import GetData from '../GetData';
import { useAlert } from 'react-alert';

export default function MessageControls({ source, radio, icon, volume, handlePlayBtn, handleAudio, handleVolume }) {
  const context = useContext(Context);
  const alert = useAlert();
  const [songName, setSongName] = useState(null);
  const [time, setTime] = useState(moment().format("h:mm:ss a"))
  const timer = () => setTime(moment().format("H:mm:ss"))

  useEffect(() => {
    let mounted = true;

    GetData("/infobar")
      .then(data => {
        if (!data.success) alert.error("Failed to fetch data, please contact the admin.");
        if (data.status === 403) {
          alert.error("Status 403: Forbidden")
          return
        }
        if (!data.success) {
          alert.error("Failed to fetch data, please contact the admin")
          return
        };
        context.setInfoBarMessage(data.infoBar[0].message)
        context.setInfoID(data.infoBar[0]._id)
      })
      .catch(err => {
        console.log(err)
        alert.error('Failed to fetch info. Please contact the admin.')
      })
    
    const getSongName = () => {
      fetch('https://cors-anywhere.herokuapp.com/https://s9.myradiostream.com/44782/stats?json=1')
        .then(res => res.json())
        .then(data => {
          let titleWords = [];
          let sanitizedTitle = '';
    
          // Separate words
          if (data.songtitle.includes('_')) {
            titleWords = data.songtitle.split('_');
          }
          if (data.songtitle.includes(' ')) {
            titleWords = data.songtitle.split(' ');
          }
    
          // Sanitize word
          titleWords.forEach(word => {
            let sanitizedWord = word[0].toLocaleUpperCase() + word.substring(1).toLocaleLowerCase();
            sanitizedTitle += sanitizedWord + ' ';
          })
    
          // Set title
          if (mounted) {
            if (sanitizedTitle === "") {
              setSongName("Etikett Radio Archive")
            } else {
            setSongName(sanitizedTitle);
            }
          }
        })
        .catch((err, data) => {
          console.log(err)
          setSongName("Etikett Radio Archive");
        })
    };
    getSongName();
    const everyFifteenSeconds = setInterval(getSongName, 1000 * 15);
  
    return () => {
      clearInterval(everyFifteenSeconds);
      mounted = false;
    }
  }, [])
    
    useEffect(() => {
      const id = setInterval(timer, 1000); 
      return () => clearInterval(id);
    }, [time]);
    

  return (
    <section className="message-controls-container">
      {source === radio ?
        <div className="player-controls">
          <button className="playPauseBtn" onClick={handlePlayBtn} role="play-pause button"></button>
          <img className="audio-icon" src={icon} alt="speaker icon" width="18" onClick={handleAudio} />
          <input className="volumeControl" type="range" min="0" max="1" step="any" value={volume} onChange={handleVolume} role="volume" />
        </div>
        : null}
      <div className="message">
        <span className="moving-text"> {time} -- Now playing: {songName} -- {context.infoBarMessage}</span>
      </div>

    </section>
  )
}
