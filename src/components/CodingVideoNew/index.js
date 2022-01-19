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

  return (
    <div>
      <h1>New Video Coding</h1>
    
      <h4>Seleccione un Video de la exhibición</h4>
      {
        currentExhibitVideos.map((video) => {
          const { id, url } = video;
          return (
            <div key={url}>
              <button onClick={() => handleVideoSelect(video)}> Seleccionar</button>
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

      <Link to={selectedVideo ? '/coding-video' : ''} >
        <button className="card" disabled={!selectedVideo}>
          <div className="card-inner">
            <span className="card-pin"></span>
            <div className="card-content">
              <h2 className="card-title">Comenzar Coding</h2> 
            </div>
          </div>
        </button>
      </Link>
    </div>
  );
}

export default CodingVideoNew;
