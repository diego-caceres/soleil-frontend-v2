import "./CodingVideo.scss";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import { SelectExhibit } from "../SelectExhibit";
import { saveCoding } from "src/redux/codings";
import { toHHMMSS } from "src/utils";
import {
  genderOptions,
  ageOptions,
  groupOptions,
  languageOptions,
  dayStatusOptions,
} from "src/constants";
import { loadBehaviors } from "src/redux/behaviors";

const CodingVideo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const playerRef = useRef();

  const [codingBehaviors, setCodingBehaviors] = useState([]);
  const [showFacilitator, setShowFacilitator] = useState(false);

  const [gender, setGender] = useState(null);
  const [ageRange, setAgeRange] = useState(null);
  const [amount, setAmount] = useState(null);
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState({
    value: "spanish",
    label: "Spanish",
  });

  const [dayStatus, setDayStatus] = useState({
    value: "nonBusyDat",
    label: "Non busy day",
  });
  const [observations, setObservations] = useState("");

  const [facilitatorGender, setFacilitatorGender] = useState(null);
  const [facilitatorAgeRange, setFacilitatorAgeRange] = useState(null);

  const [videoURL, setVideoURL] = useState("");
  const [videoName, setVideoName] = useState("");

  const exhibitsStore = useSelector((state) => state.exhibits);
  const { selectedExhibit, currentEvaluator } = exhibitsStore;
  const behaviorsStore = useSelector((state) => state.behaviors);
  const { visitorBehaviors, facilitatorBehaviors } = behaviorsStore;
  const codingsStore = useSelector((state) => state.codings);
  const { savingCoding } = codingsStore;

  useEffect(() => {
    if (visitorBehaviors.length === 0 || facilitatorBehaviors.length === 0) {
      dispatch(loadBehaviors());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (visitorBehaviors.length === 0 || facilitatorBehaviors.length === 0) {
    return <div>loading</div>;
  }

  // Separamos los comportamientos del Facilitador por categoria
  const confortBehaviors = facilitatorBehaviors.filter(
    (bh) => bh.type === "Confort"
  );
  const reflectionBehaviors = facilitatorBehaviors.filter(
    (bh) => bh.type === "Reflection"
  );
  const exhibitUseBehaviors = facilitatorBehaviors.filter(
    (bh) => bh.type === "Exhibit Use"
  );
  const informationBehaviors = facilitatorBehaviors.filter(
    (bh) => bh.type === "Information"
  );

  // Handle File Search
  const handleFileClicked = (ev) => {
    const file = ev.target.files[0];
    setVideoURL(URL.createObjectURL(file));
    setVideoName(file.name);
  };

  const resetCoding = () => {
    setGender(null);
    setAgeRange(null);
    setAmount(null);
    setDescription("");
    setObservations("");
    setShowFacilitator(false);
    setFacilitatorGender(null);
    setFacilitatorAgeRange(null);
    setCodingBehaviors([]);

    setVideoName("");
    setVideoURL("");
  };

  const addBehaviorToCoding = (behavior) => {
    const seconds = getVideoTimeInSeconds();
    let newList = [...codingBehaviors];

    if (behavior.forFacilitator && !showFacilitator) {
      // On the first Facilitator Behavior, we turn the flag on for validations
      setShowFacilitator(true);
    }

    // If this behavior was added before, with no end time, it is the end time
    // Photo is instant
    const behaviorsOfSameId = codingBehaviors.filter(
      (c) => c.id === behavior.id && c.name !== "Photo"
    );
    const lastBehavior =
      behaviorsOfSameId.length > 0 ? behaviorsOfSameId[0] : null;
    if (lastBehavior && !lastBehavior.timeEnded) {
      // Add End Time
      const index = newList.findIndex((cb) => cb.id === lastBehavior.id);
      newList[index].timeEnded = seconds;
    } else {
      // New Behavior at the beginning of the list
      const codingBehavior = {
        ...behavior,
        timeMarked: seconds,
      };
      newList = [codingBehavior, ...codingBehaviors];
    }

    setCodingBehaviors(newList);
  };

  const removeCoding = (codingIndex) => {
    const newList = [...codingBehaviors];
    newList.splice(codingIndex, 1);
    setCodingBehaviors(newList);
  };

  const getVideoTimeInSeconds = () => {
    if (playerRef && playerRef.current) {
      let seconds = playerRef.current.getCurrentTime();
      seconds = Math.round(seconds * 100) / 100;

      return seconds;
    }
    return null;
  };

  const goToVideoAt = (time) => {
    if (playerRef && playerRef.current) {
      playerRef.current.seekTo(time);
    }
  };

  const validateFields = () => {
    if (codingBehaviors.length === 0) {
      alert("Add at least one interaction!");
      return false;
    }

    if (!gender || gender.value.length === 0) {
      alert("You have to select the visitor gender!");
      return false;
    }

    if (!ageRange || ageRange.value.length === 0) {
      alert("You have to select the visitor age!");
      return false;
    }

    if (!amount || amount.value.length === 0) {
      alert("You have to select the visitors amount!");
      return false;
    }

    if (showFacilitator) {
      if (!facilitatorGender || facilitatorGender.value.length === 0) {
        alert("You have to select the facilitator gender!");
        return false;
      }

      if (!facilitatorAgeRange || facilitatorAgeRange.value.length === 0) {
        alert("You have to select the facilitator age!");
        return false;
      }
    }

    return true;
  };

  const sendCodingToBackend = (callback) => {
    const videoDuration = playerRef.current.getDuration();
    dispatch(
      saveCoding(
        {
          codingType: "video",
          exhibitId: selectedExhibit.id,
          evaluatorId: currentEvaluator.id,
          evaluatorName: currentEvaluator.name,
          extraObservations: observations,
          dayStatus: dayStatus.value,
          visitor: {
            gender: gender.value,
            ageRange: ageRange.value,
            typeOfGroup: amount.value,
            description: description,
            language: language.value,
          },
          showFacilitator: showFacilitator,
          facilitator: {
            gender: showFacilitator ? facilitatorGender.value : "",
            ageRange: showFacilitator ? facilitatorAgeRange.value : "",
          },
          codingBehaviors: codingBehaviors,
          videoName,
          videoDuration,
        },
        callback
      )
    );
  };

  const onNewVisitorClicked = () => {
    if (validateFields()) {
      sendCodingToBackend((message, success) => {
        alert(message);

        if (success) {
          resetCoding();
        }
      });
    }
  };

  const onEndClicked = () => {
    if (validateFields()) {
      sendCodingToBackend((message, success) => {
        alert(message);

        if (success) {
          navigate("/");
        }
      });
    }
  };

  const visitorBehaviorsOpen = codingBehaviors.filter(
    (c) => c.forVisitor && !c.timeEnded && c.name !== "Photo"
  );
  const visitorBehaviorsFirst4 = visitorBehaviors.slice(0, 4);
  const visitorBehaviorsRest = visitorBehaviors.slice(4);

  const facilitatorBehaviorsOpen = codingBehaviors.filter(
    (c) => c.forFacilitator && !c.timeEnded && c.name !== "Photo"
  );

  if (!selectedExhibit) {
    return (
      <div className="video-coding-container">
        <div className="select-exhibit-section">
          <SelectExhibit />
        </div>
      </div>
    );
  }

  return (
    <div className="video-coding-container">
      <div className="coding-section">
        <div className="top-half">
          <div className="video-section">
            {videoURL ? (
              <ReactPlayer url={videoURL} ref={playerRef} controls />
            ) : (
              <div>
                <label>Seleccione un video de su computadora</label>
                <input
                  id="upload"
                  type="file"
                  accept="video/*"
                  onChange={handleFileClicked}
                />
              </div>
            )}
          </div>

          <div className="characteristics-section">
            <span className="title">Visitor</span>
            <div className="select-container">
              <Select
                placeholder="Gender"
                options={genderOptions}
                value={gender}
                onChange={setGender}
              />
            </div>
            <div className="select-container">
              <Select
                placeholder="Age"
                options={ageOptions}
                value={ageRange}
                onChange={setAgeRange}
              />
            </div>

            <div className="select-container">
              <Select
                placeholder="Group"
                value={amount}
                options={groupOptions}
                onChange={setAmount}
              />
            </div>

            <span className="title">Facilitator</span>
            <div className="select-container">
              <Select
                placeholder="Gender"
                options={genderOptions}
                value={facilitatorGender}
                onChange={setFacilitatorGender}
              />
            </div>
            <div className="select-container">
              <Select
                placeholder="Age"
                options={ageOptions}
                value={facilitatorAgeRange}
                onChange={setFacilitatorAgeRange}
              />
            </div>

            <span className="title">General</span>
            <div className="select-container">
              <Select
                placeholder="Language"
                value={language}
                options={languageOptions}
                onChange={setLanguage}
              />
            </div>
            <div className="select-container">
              <Select
                placeholder="Day Status"
                value={dayStatus}
                options={dayStatusOptions}
                onChange={setDayStatus}
              />
            </div>
          </div>
        </div>

        <div className="bottom-half">
          <div className="visitor-section">
            <div className="top-row">
              <div className="visitor-behaviors-container first-four-interactions">
                {visitorBehaviorsFirst4.map((behavior) => {
                  const { id, name } = behavior;
                  const selectedClass = visitorBehaviorsOpen.find(
                    (vb) => vb.id === id
                  )
                    ? "behavior-item-selected"
                    : "";
                  return (
                    <div
                      key={name}
                      className={`visitor-behaviors-item ${selectedClass}`}
                    >
                      <button
                        onClick={() => addBehaviorToCoding(behavior)}
                        style={{ background: "#DA4453" }}
                      >
                        {name}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="visitor-behaviors-container">
              {visitorBehaviorsRest.map((behavior, index) => {
                const { id, name } = behavior;
                const selectedClass = visitorBehaviorsOpen.find(
                  (vb) => vb.id === id
                )
                  ? "behavior-item-selected"
                  : "";
                return (
                  <div
                    key={name}
                    className={`visitor-behaviors-item ${selectedClass}`}
                  >
                    <button
                      onClick={() => addBehaviorToCoding(behavior)}
                      style={
                        index < 3
                          ? { background: "#E9573F" }
                          : { background: "#F6BB42" }
                      }
                    >
                      {name}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="facilitator-section">
            <div className="bottom-row">
              <div className="facilitator-behaviors-container">
                {confortBehaviors.map((behavior) => {
                  const { id, name } = behavior;
                  const selectedClass = facilitatorBehaviorsOpen.find(
                    (vb) => vb.id === id
                  )
                    ? "behavior-item-selected"
                    : "";
                  return (
                    <div
                      key={name}
                      className={`facilitator-behaviors-item ${selectedClass}`}
                    >
                      <button
                        onClick={() => addBehaviorToCoding(behavior)}
                        className="confort-behavior-btn"
                      >
                        {name}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="facilitator-behaviors-container">
                {exhibitUseBehaviors.map((behavior) => {
                  const { id, name } = behavior;
                  const selectedClass = facilitatorBehaviorsOpen.find(
                    (vb) => vb.id === id
                  )
                    ? "behavior-item-selected"
                    : "";

                  return (
                    <div
                      key={name}
                      className={`facilitator-behaviors-item ${selectedClass}`}
                    >
                      <button
                        onClick={() => addBehaviorToCoding(behavior)}
                        className="exhibitUse-behavior-btn"
                      >
                        {name}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="facilitator-behaviors-container">
                {reflectionBehaviors.map((behavior) => {
                  const { id, name } = behavior;
                  const selectedClass = facilitatorBehaviorsOpen.find(
                    (vb) => vb.id === id
                  )
                    ? "behavior-item-selected"
                    : "";

                  return (
                    <div
                      key={name}
                      className={`facilitator-behaviors-item ${selectedClass}`}
                    >
                      <button
                        onClick={() => addBehaviorToCoding(behavior)}
                        className="reflection-behavior-btn"
                      >
                        {name}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="facilitator-behaviors-container">
                {informationBehaviors.map((behavior) => {
                  const { id, name } = behavior;
                  const selectedClass = facilitatorBehaviorsOpen.find(
                    (vb) => vb.id === id
                  )
                    ? "behavior-item-selected"
                    : "";

                  return (
                    <div
                      key={name}
                      className={`facilitator-behaviors-item ${selectedClass}`}
                    >
                      <button
                        onClick={() => addBehaviorToCoding(behavior)}
                        className="information-behavior-btn"
                      >
                        {name}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="finish-section">
        <div className="list-interactions-section">
          <div className="title-row">
            <h2>List of interactions</h2>
          </div>
          <div className="list-row">
            {codingBehaviors.length === 0 ? (
              <p>No interactions added yet</p>
            ) : (
              codingBehaviors.map((codingBehavior, codingIndex) => {
                const {
                  name,
                  forVisitor,
                  forFacilitator,
                  timeMarked,
                  timeEnded,
                } = codingBehavior;
                let timeRange = `at ${toHHMMSS(timeMarked)}`;
                if (timeEnded) {
                  timeRange = `${timeRange} until ${toHHMMSS(timeEnded)}`;
                }
                return (
                  <div key={codingIndex}>
                    {forVisitor && <span>Visitor => </span>}
                    {forFacilitator && <span>Facilitator => </span>}
                    {name}{" "}
                    <button onClick={() => goToVideoAt(timeMarked)}>
                      {" "}
                      {`[${timeRange}]`}{" "}
                    </button>
                    -{" "}
                    <button onClick={() => removeCoding(codingIndex)}>
                      {" "}
                      X{" "}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="description-container">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Visitor description"
          />
        </div>

        <div className="observation-container">
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            type="text"
            placeholder="Observations"
          />
        </div>

        <div className="nextSteps">
          <button
            className="end-buttons-new"
            onClick={onNewVisitorClicked}
            disabled={savingCoding}
          >
            New visitor
          </button>
          <button
            className="end-buttons-end"
            onClick={onEndClicked}
            disabled={savingCoding}
          >
            END
          </button>
        </div>
      </div>

      {/* <div className="footer" style={{ marginLeft: '5px' }}>
        <p>(C) Sole is awesome, 2021</p>
        <p>(C) Diego is awesomer, 2022</p>
      </div> */}
    </div>
  );
};

export default CodingVideo;
