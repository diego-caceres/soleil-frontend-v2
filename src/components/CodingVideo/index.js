import './CodingVideo.scss';
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ReactPlayer from 'react-player'
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

import { loadBehaviorsForFacilitator, loadBehaviorsForVisitor } from 'src/redux/behaviors'
import { saveCoding } from 'src/redux/codings';
import { toHHMMSS } from 'src/utils';
import { genderOptions, ageOptions, groupOptions, languageOptions, dayStatusOptions } from 'src/constants';

const CodingVideo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const playerRef = useRef();

  const [codingBehaviors, setCodingBehaviors] = useState([]);
  const [showFacilitator, setShowFacilitator] = useState(false);

  const [gender, setGender] = useState(null);
  const [ageRange, setAgeRange] = useState(null);
  const [amount, setAmount] = useState(null);
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState({ value: 'spanish', label: 'Spanish' });

  const [dayStatus, setDayStatus] = useState({ value: 'nonBusyDat', label: 'Non busy day' });
  const [observations, setObservations] = useState('');

  const [facilitatorGender, setFacilitatorGender] = useState(null);
  const [facilitatorAgeRange, setFacilitatorAgeRange] = useState(null);

  const [videoURL, setVideoURL] = useState('');
  const [videoName, setVideoName] = useState('');

  const exhibitsStore = useSelector((state) => state.exhibits);
  const { selected, currentEvaluator } = exhibitsStore;
  const behaviorsStore = useSelector((state) => state.behaviors);
  const { visitorBehaviors, facilitatorBehaviors } = behaviorsStore;
  const codingsStore = useSelector((state) => state.codings);
  const { savingCoding } = codingsStore;

  // componentDidMount
  useEffect(() => {
    dispatch(loadBehaviorsForFacilitator());
    dispatch(loadBehaviorsForVisitor());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (visitorBehaviors.length === 0 || facilitatorBehaviors.length === 0) {
    return <div>loading</div>
  }

  // Separamos los comportamientos del Facilitador por categoria
  const confortBehaviors = facilitatorBehaviors.filter(bh => bh.type === 'Confort');
  const reflectionBehaviors = facilitatorBehaviors.filter(bh => bh.type === 'Reflection');
  const exhibitUseBehaviors = facilitatorBehaviors.filter(bh => bh.type === 'Exhibit Use');
  const informationBehaviors = facilitatorBehaviors.filter(bh => bh.type === 'Information');


  // Handle File Search
  const handleFileClicked = (ev) => {
    const file = ev.target.files[0];
    setVideoURL(URL.createObjectURL(file));
    setVideoName(file.name);
  }

  const resetCoding = () => {
    setGender(null);
    setAgeRange(null);
    setAmount(null);
    setDescription('');
    setObservations('');
    setShowFacilitator(false);
    setFacilitatorGender(null);
    setFacilitatorAgeRange(null);
    setCodingBehaviors([]);

    setVideoName('');
    setVideoURL('');
  }

  const addBehaviorToCoding = (behavior) => {
    const seconds = getVideoTimeInSeconds();
    let newList = [
      ...codingBehaviors,
    ]

    if (behavior.forFacilitator && !showFacilitator) {
      // On the first Facilitator Behavior, we turn the flag on for validations
      setShowFacilitator(true);
    }
  
    // If this behavior was added before, with no end time, it is the end time
    // Photo is instant
    const behaviorsOfSameId = codingBehaviors.filter(c => c.id === behavior.id && c.name !== 'Photo');
    const lastBehavior = behaviorsOfSameId.length > 0 ? behaviorsOfSameId[0] : null;
    if (lastBehavior && !lastBehavior.timeEnded) {
      // Add End Time
      const index = newList.findIndex(cb => cb.id === lastBehavior.id);
      newList[index].timeEnded = seconds;
    }    
    else {
      // New Behavior at the beginning of the list
      const codingBehavior = {
        ...behavior,
        timeMarked: seconds
      }
      newList = [
        codingBehavior,
        ...codingBehaviors,
      ]
    }
    
    setCodingBehaviors(newList);
  } 

  const removeCoding = (codingIndex) => {
    const newList = [...codingBehaviors];
    newList.splice(codingIndex, 1);
    setCodingBehaviors(newList);
  }
  
  const getVideoTimeInSeconds = () => {
    if (playerRef && playerRef.current) {
      let seconds = playerRef.current.getCurrentTime();
      seconds = Math.round(seconds * 100) / 100;

      return seconds;
    }
    return null;
  }

  const goToVideoAt = (time) => {
    if (playerRef && playerRef.current) {
      playerRef.current.seekTo(time);
    }
  }

  const validateFields = () => {
    if (codingBehaviors.length === 0) {
      alert('Add at least one interaction!');
      return false;
    }

    if (!gender || gender.value.length === 0) {
      alert('You have to select the visitor gender!');
      return false;
    }

    if (!ageRange || ageRange.value.length === 0) {
      alert('You have to select the visitor age!');
      return false;
    }

    if (!amount || amount.value.length === 0) {
      alert('You have to select the visitors amount!');
      return false;
    }

    if (showFacilitator) {
      if (!facilitatorGender || facilitatorGender.value.length === 0) {
        alert('You have to select the facilitator gender!');
        return false;
      }
  
      if (!facilitatorAgeRange || facilitatorAgeRange.value.length === 0) {
        alert('You have to select the facilitator age!');
        return false;
      }
    }

    return true;
  }

  const sendCodingToBackend = (callback) => {
    const videoDuration = playerRef.current.getDuration();
    dispatch(saveCoding({
      codingType: 'video',
      exhibitId: selected.id,
      evaluatorId: currentEvaluator.id,
      evaluatorName: `${currentEvaluator?.name} ${currentEvaluator?.lastName}`,
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
        gender: showFacilitator ? facilitatorGender.value : '',
        ageRange: showFacilitator ? facilitatorAgeRange.value : ''
      },
      codingBehaviors: codingBehaviors,
      videoName,
      videoDuration
    }, callback));
  }

  const onNewVisitorClicked = () => {
    if (validateFields()) {
      sendCodingToBackend(
        (message, success) => {
          alert(message);

          if (success) {
            resetCoding();
          }
        }
      );
    }
  }

  const onEndClicked = () => {
    if (validateFields()) {
      sendCodingToBackend(
        (message, success) => {
          alert(message);

          if (success) {
            navigate('/');
          }
        }
      );
    }
  }

  return (
    <div className="video-coding-container">
      <div className="header-row">Video Coding!! | Exhibit: {selected.name} | Evaluator: {`${currentEvaluator.name} ${currentEvaluator.lastName}`} | <a href='/'>Go Back</a></div>      
      <div className="top-half">
        <div className="video-section">
          {/* <div div>Selected Exhibit: {selected?.name}</div>
          <div div>Selected Coder: {currentEvaluator?.name} {currentEvaluator?.lastName}</div> */}
          {videoURL ? (
            <ReactPlayer
              url={videoURL}
              ref={playerRef}
              controls
            />
          ) : (
            <div>
              <label>Seleccione un video de su computadora</label>
              <input id="upload" type="file" accept="video/*"
                onChange={handleFileClicked}
              />
            </div>
          )}
          
        </div>
        <div className="list-interactions-section">
          <div className="title-row">
            <h2>List of interactions</h2>
          </div>
          <div className="list-row">
            {codingBehaviors.length === 0
            ? (
              <p>No interactions added yet</p>
            )
            : (
              codingBehaviors.map((codingBehavior, codingIndex) => {
                const { name, forVisitor, forFacilitator, timeMarked, timeEnded } = codingBehavior;
                let timeRange = `at ${toHHMMSS(timeMarked)}`;
                if (timeEnded) {
                  timeRange = `${timeRange} until ${toHHMMSS(timeEnded)}`
                }
                return (
                  <div key={codingIndex}>
                    {forVisitor && <span>Visitor => </span>}
                    {forFacilitator && <span>Facilitator => </span>}
                    {name} <button onClick={() => goToVideoAt(timeMarked)}> {`[${timeRange}]`} </button>
                    - <button onClick={() => removeCoding(codingIndex)}> X </button>
                  </div>
                )
              })
            )}
          </div>
          <div className="nextSteps">
            <button
              className="end-buttons"
              onClick={onNewVisitorClicked}
              disabled={savingCoding}
            >
              new visitor
            </button>
            <button
              className="end-buttons"
              onClick={onEndClicked}
              disabled={savingCoding}
            >
              end
            </button>
          </div>
        </div>
      </div>
      
      <div className="bottom-half">
        <div className="visitor-section"> 
          <div className="top-row">
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
          <div className="bottom-row">
            <div className="left-col">
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
            <div className="right-col">
              <div className="visitor-behaviors-container">
                {visitorBehaviors.map(behavior => {
                  const { name } = behavior;
                  return (
                    <div
                      key={name}
                      className="visitor-behaviors-item"
                    >
                      <button
                        onClick={() => addBehaviorToCoding(behavior)}
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
        <div className="facilitator-section">
          <>
            <div className="top-row">
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
            <div className="bottom-row">
              <div className="facilitator-behaviors-container">
                {confortBehaviors.map(behavior => {
                  const { name } = behavior;
                  return (
                    <div
                      key={name}
                      className="facilitator-behaviors-item"
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
                {reflectionBehaviors.map(behavior => {
                  const { name } = behavior;
                  return (
                    <div
                      key={name}
                      className="facilitator-behaviors-item"
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
                {exhibitUseBehaviors.map(behavior => {
                  const { name } = behavior;
                  return (
                    <div
                      key={name}
                      className="facilitator-behaviors-item"
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
                {informationBehaviors.map(behavior => {
                  const { name } = behavior;
                  return (
                    <div
                      key={name}
                      className="facilitator-behaviors-item"
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
          </>
        </div>       
      </div>
      
      {/* <div className="footer" style={{ marginLeft: '5px' }}>
        <p>(C) Sole is awesome, 2021</p>
        <p>(C) Diego is awesomer, 2022</p>
      </div> */}
    </div>
  );
}

export default CodingVideo;
