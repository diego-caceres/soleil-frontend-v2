import "./CodingLive.scss";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";

import Select from "react-select";

import { saveCoding } from "src/redux/codings";
import { toHHMMSS } from "src/utils";
import {
  genderOptions,
  ageOptions,
  groupOptions,
  languageOptions,
  dayStatusOptions,
} from "src/constants";

const CodingLive = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { seconds, minutes, hours, start, reset, pause } = useStopwatch({
    autoStart: false,
  });
  const totalSeconds = seconds + minutes * 60 + hours * 60 * 60;
  const stopWatchToShow = toHHMMSS(totalSeconds);

  const [timerStarted, setTimerStarted] = useState(false);
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

  const exhibitsStore = useSelector((state) => state.exhibits);
  const { selectedExhibit, currentEvaluator } = exhibitsStore;
  const behaviorsStore = useSelector((state) => state.behaviors);
  const { visitorBehaviors, facilitatorBehaviors } = behaviorsStore;
  const codingsStore = useSelector((state) => state.codings);
  const { savingCoding } = codingsStore;

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

    pause();
    reset();
    setTimerStarted(false);
  };

  const handleStartTimer = () => {
    setTimerStarted(true);
    start();
  };

  const addBehaviorToCoding = (behavior) => {
    if (!timerStarted) {
      handleStartTimer();
    }

    const currentSeconds = seconds + minutes * 60 + hours * 60 * 60;
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
      newList[index].timeEnded = currentSeconds;
    } else {
      // New Behavior at the beginning of the list
      const codingBehavior = {
        ...behavior,
        timeMarked: currentSeconds,
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
    dispatch(
      saveCoding(
        {
          codingType: "live",
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
          videoName: "",
          videoDuration: "",
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

  if (!selectedExhibit) {
    return (
      <div>
        <p>No Exhibit selected.</p>
      </div>
    );
  }

  const visitorBehaviorsOpen = codingBehaviors.filter(
    (c) => c.forVisitor && !c.timeEnded && c.name !== "Photo"
  );
  const facilitatorBehaviorsOpen = codingBehaviors.filter(
    (c) => c.forFacilitator && !c.timeEnded && c.name !== "Photo"
  );
  return (
    <div className="live-coding-container">
      <div className="top-half">
        <div className="visitor-section">
          <div className="first-row">
            <div className="visitor-behaviors-container">
              {visitorBehaviors.map((behavior) => {
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
                    <button onClick={() => addBehaviorToCoding(behavior)}>
                      {name}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="second-row">
            <div className="visitor-row">
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                placeholder="visitor description"
              />
            </div>
            <div className="observation-row">
              <input
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                type="text"
                placeholder="observations"
              />
            </div>
          </div>
          <div className="third-row">
            <Select
              placeholder="Gender"
              options={genderOptions}
              value={gender}
              onChange={setGender}
            />

            <Select
              placeholder="Age"
              options={ageOptions}
              value={ageRange}
              onChange={setAgeRange}
            />

            <Select
              placeholder="Group"
              value={amount}
              options={groupOptions}
              onChange={setAmount}
            />

            <Select
              placeholder="Language"
              value={language}
              options={languageOptions}
              onChange={setLanguage}
            />

            <Select
              placeholder="Day Status"
              value={dayStatus}
              options={dayStatusOptions}
              onChange={setDayStatus}
            />
          </div>
        </div>
        <div className="facilitator-section">
          <>
            <div className="behaviors-row">
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
            <div className="selects-row">
              <Select
                placeholder="Gender"
                options={genderOptions}
                value={facilitatorGender}
                onChange={setFacilitatorGender}
              />

              <Select
                placeholder="Age"
                options={ageOptions}
                value={facilitatorAgeRange}
                onChange={setFacilitatorAgeRange}
              />
            </div>
          </>
        </div>
      </div>
      <div className="bottom-half">
        <div className="list-interactions-section">
          <div className="title-row">
            <h2>List of interactions</h2>

            {timerStarted ? (
              <div style={{ fontSize: "30px" }}>{stopWatchToShow}</div>
            ) : (
              <div className="timer-button">
                <button onClick={handleStartTimer}>Start</button>
              </div>
            )}
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
                    {name} <span> {`[${timeRange}]`} </span>-{" "}
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
        <div className="end-section">
          <div className="nextSteps">
            <button
              className="end-live-buttons"
              onClick={onNewVisitorClicked}
              disabled={savingCoding}
            >
              new visitor
            </button>
            <button
              className="end-live-buttons"
              onClick={onEndClicked}
              disabled={savingCoding}
            >
              end
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CodingLive;
