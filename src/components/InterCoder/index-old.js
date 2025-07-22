import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../config/firebase";


import "./intercoder.css";

// import { loadVideoNames, setSelectedVideo } from "src/redux/interCoder";
import {
  calculateIntercoderSimilarity,
  getDateStringFromTimestamp,
  isInBoth,
} from "src/utils";

function InterCoder() {
  const [codings, setCodings] = useState([]);
  const [videoNames, setVideoNames] = useState([]);
  const [deltaTime] = useState(1.5);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [codingA, setCodingA] = useState("");
  const [codingB, setCodingB] = useState("");
  const [interCoderReliability, setInterCoderReliability] = useState(null);

  useEffect(() => {
    async function fetchCodings() {
      const codingsCollection = collection(db, "codings");
      const codingsSnapshot = await getDocs(codingsCollection);
      const codingsData = codingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCodings(codingsData);

      const uniqueVideoNames = Array.from(
        new Set(codingsData.map((coding) => coding.videoName))
      );
      setVideoNames(uniqueVideoNames);
    }

    fetchCodings();
  }, []);

  const handleVideoSelect = (event) => {
    const selectedVideoName = event.target.value;
    setSelectedVideo(selectedVideoName);
    setCodingA("");
    setCodingB("");
  };

  const filterCodingsByVideo = (videoName) => {
    return codings.filter((coding) => coding.videoName === videoName);
  };

  const handleCodingASelect = (event) => {
    const selectedCodingId = event.target.value;
    const selectedCoding = filterCodingsByVideo(selectedVideo).find(
      (coding) => coding.id === selectedCodingId
    );
    setCodingA(selectedCoding);
    setInterCoderReliability(null);
  };

  const handleCodingBSelect = (event) => {
    const selectedCodingId = event.target.value;
    const selectedCoding = filterCodingsByVideo(selectedVideo).find(
      (coding) => coding.id === selectedCodingId
    );
    setCodingB(selectedCoding);
    setInterCoderReliability(null);
  };

  const isCalculateButtonEnabled = codingA && codingB;

  const handleCalculateClick = () => {
    // Perform your intercoder similarity calculation here using codingA and codingB
    // You can use the calculateIntercoderSimilarity function from the earlier conversation
    // or your custom implementation
    // For example:
    const intercoderSimilarity = calculateIntercoderSimilarity(
      codingA,
      codingB,
      deltaTime
    );
    setInterCoderReliability(intercoderSimilarity);

    // ITE Ignore Time Ended
    calculateIntercoderSimilarity(
      codingA,
      codingB,
      deltaTime,
      true
    );
  };

  const renderCodingBehaviorsComparison = () => {
    if (!codingA || !codingB) {
      return null;
    }

    let behaviorANames = [];
    codingA.codingBehaviors.filter(
      (behavior) => {
        if (!behaviorANames.includes(behavior.name)) {
          behaviorANames.push(behavior.name);
          return true;
        }
        return false;
      }
    );

    let behaviorBNames = [];
    codingB.codingBehaviors.filter(
      (behavior) => {
        if (!behaviorBNames.includes(behavior.name)) {
          behaviorBNames.push(behavior.name);
          return true;
        }
        return false;
      }
    );

    const behaviorsPosible = [
      ...behaviorANames,
      ...behaviorBNames.filter((b) => !behaviorANames.includes(b)),
    ];

    return (
      <table>
        <thead>
          <tr>
            <th>Behavior</th>
            <th>Coding A</th>
            <th>Coding A</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {behaviorsPosible.map((behavior, index) => (
            <tr
              key={index}
              style={{
                backgroundColor: isInBoth(
                  behavior,
                  behaviorANames,
                  behaviorBNames
                )
                  ? "#47b647"
                  : "white",
              }}
            >
              <td>{behavior}</td>
              <td>{behaviorANames.includes(behavior) ? "Yes" : "No"}</td>
              <td>{behaviorBNames.includes(behavior) ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };


  return (
    <div className="intercoder-wrapper">
      <div className="intercoder-select">
        <label>Select Video:</label>
        <select value={selectedVideo} onChange={handleVideoSelect}>
          <option value="">Select Video</option>
          {videoNames.map((videoName, index) => (
            <option key={index} value={videoName}>
              {videoName}
            </option>
          ))}
        </select>
      </div>

      {selectedVideo && (
        <div>
          <div className="intercoder-select">
            <label>Select Coding A:</label>
            <select
              value={codingA ? codingA.id : ""}
              onChange={handleCodingASelect}
            >
              <option value="">Select Coding A</option>
              {filterCodingsByVideo(selectedVideo).map((coding, index) => (
                <option key={index} value={coding.id}>
                  {coding.evaluatorName} -{" "}
                  {getDateStringFromTimestamp(coding.codedDate)}
                </option>
              ))}
            </select>
          </div>
          <div className="intercoder-select">
            <label>Select Coding B:</label>
            <select
              value={codingB ? codingB.id : ""}
              onChange={handleCodingBSelect}
            >
              <option value="">Select Coding B</option>
              {filterCodingsByVideo(selectedVideo).map((coding, index) => (
                <option key={index} value={coding.id}>
                  {coding.evaluatorName} -{" "}
                  {getDateStringFromTimestamp(coding.codedDate)}
                </option>
              ))}
            </select>
          </div>

          {/* <div>
            <label>Delta Time:</label>
            <input
              type="number"
              value={deltaTime}
              onChange={(event) => setDeltaTime(event.target.value)}
            />
          </div> */}

          <div>
            <button
              onClick={handleCalculateClick}
              disabled={!isCalculateButtonEnabled}
            >
              Calculate
            </button>
          </div>

          {interCoderReliability && (
            <>
              <div>
                <h3>Intercoder Similarity: {interCoderReliability}%</h3>
              </div>

              {/* <div>
                <h3>
                  Intercoder Similarity ITE (Ignore Time Ended):{" "}
                  {interCoderReliabilityITE}%
                </h3>
              </div> */}

              {renderCodingBehaviorsComparison()}
            </>
          )}
        </div>
      )}

      {/* You can display the selected codingA and codingB if needed */}
    </div>
  );
}

export default InterCoder;
/*
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

  const handleCalculateClick = () => {
    const intercoderSimilarity = calculateIntercoderSimilarity();
    console.log(intercoderSimilarity);

  }

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

export default InterCoder;*/
