import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";

import { loadVideoNames, setSelectedVideo } from "src/redux/interCoder";

const InterCoder = () => {
  const interCodersStore = useSelector((state) => state.interCoders);
  const { videoNames, selectedVideo } = interCodersStore;
  const dispatch = useDispatch();

  const [videoOptions, setVideoOptions] = useState([]);

  let currentVideoOption = null;
  if (selectedVideo) {
    currentVideoOption = {
      value: selectedVideo,
      label: selectedVideo,
    };
  }

  // componentDidMount
  useEffect(() => {
    dispatch(loadVideoNames());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (videoNames && videoNames.length > 0) {
      const videos = videoNames.map((videoName) => ({
        value: videoName,
        label: videoName,
      }));
      setVideoOptions(videos);
    }
  }, [videoNames]);

  const handleVideoChange = ({ value }) => {
    if (value) {
      dispatch(setSelectedVideo({ videoName: value }));
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Inter Coder Reliability</h1>

      <h4>Select a video from the list of codings</h4>
      <div className="selects-container">
        <Select
          placeholder="Select video"
          options={videoOptions}
          value={currentVideoOption}
          onChange={handleVideoChange}
        />
      </div>
    </div>
  );
};

export default InterCoder;
