import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ReactPlayer from 'react-player'

import { Link } from 'react-router-dom';

import { loadExhibitInfo, selectVideo } from 'src/redux/exhibits'

const CodingVideoNew = () => {
  const exhibitsStore = useSelector((state) => state.exhibits);
  const { selected, currentExhibitVideos, selectedVideo } = exhibitsStore;
  const dispatch = useDispatch()

  // componentDidMount
  useEffect(() => {
    if (selected) {
      dispatch(loadExhibitInfo(selected.id));
    }
  }, []);

  const handleVideoSelect = (video) => {  
    if (video) {
      dispatch(selectVideo({ video }));
    }
  }

  const startCodingButton = (
    <Link to={selectedVideo ? '/coding-video' : ''} >
      <button className="card" disabled={!selectedVideo}>
        <div className="card-inner">
          <span className="card-pin"></span>
          <div className="card-content">
            <h2 className="card-title">Start Coding</h2> 
          </div>
        </div>
      </button>
    </Link>
  )

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>New Video Coding</h1>
    
      <h4>Select a video from the exhibition</h4>
      {startCodingButton}
      {
        currentExhibitVideos.map((video) => {
          const { id, url } = video;
          const selected = selectedVideo?.id === id;
          const divStyle = { 
            display: 'flex',
            width: 'fit-content',
            margin: 'auto',
            border: selected ? '2px solid red' : '',
          };
          return (
            <div key={url} style={divStyle}>
              <button onClick={() => handleVideoSelect(video)}> Select video</button>
              <div className='video-thumbnail'>
                <ReactPlayer
                  url={url}
                  light
                  controls
                />
              </div>
            </div>
          );
        })
      }

      {startCodingButton}
    </div>
  );
}

export default CodingVideoNew;
