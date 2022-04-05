import './CodingLive.scss';
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useStopwatch } from 'react-timer-hook';

import Select from 'react-select';

import { loadBehaviorsForFacilitator, loadBehaviorsForVisitor } from 'src/redux/behaviors'
import { saveCoding } from 'src/redux/codings';
import { toHHMMSS } from 'src/utils';
import { genderOptions, ageOptions, groupOptions } from 'src/constants';


const CodingLive = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    seconds,
    minutes,
    hours,
    start,
    reset,
    pause
  } = useStopwatch({ autoStart: false });
  const totalSeconds = seconds + (minutes * 60) + (hours * 60 * 60);
  const stopWatchToShow = toHHMMSS(totalSeconds)

  const [timerStarted, setTimerStarted] = useState(false);
  const [codingBehaviors, setCodingBehaviors] = useState([]);
  const [showFacilitator, setShowFacilitator] = useState(false);

  const [gender, setGender] = useState(null);
  const [ageRange, setAgeRange] = useState(null);
  const [amount, setAmount] = useState(null);
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('Spanish');

  const [dayStatus, setDayStatus] = useState('Not Busy');
  const [observations, setObservations] = useState('');

  const [facilitatorGender, setFacilitatorGender] = useState(null);
  const [facilitatorAgeRange, setFacilitatorAgeRange] = useState(null);

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
  }, []);

  if (visitorBehaviors.length === 0 || facilitatorBehaviors.length === 0) {
    return <div>loading</div>
  }

  // Separamos los comportamientos del Facilitador por categoria
  const confortBehaviors = facilitatorBehaviors.filter(bh => bh.type === 'Confort');
  const reflectionBehaviors = facilitatorBehaviors.filter(bh => bh.type === 'Reflection');
  const exhibitUseBehaviors = facilitatorBehaviors.filter(bh => bh.type === 'Exhibit Use');
  const informationBehaviors = facilitatorBehaviors.filter(bh => bh.type === 'Information');

  const resetCoding = () => {
    setGender(null);
    setAgeRange(null);
    setAmount(null);
    setDescription('');
    setObservations('');
    setShowFacilitator(false);
    setFacilitatorGender(null);
    setFacilitatorAgeRange(null);
    setCodingBehaviors('');

    pause();
    reset();
    setTimerStarted(false);
  }

  const handleStartTimer = () => {
    setTimerStarted(true);
    start();
  }

  const handleFacilitatorInteraction = () => {
    setShowFacilitator(true);
  }

  const addBehaviorToCoding = (behavior) => {
    if (!timerStarted) {
      handleStartTimer();
    }

    const currentSeconds = seconds + (minutes * 60) + (hours * 60 * 60);
    let newList = [
      ...codingBehaviors,
    ]

    // If it is the same as the last behavior added, it is the end time
    const behaviorsOfSameType = codingBehaviors.filter(c => c.forVisitor === behavior.forVisitor);
    const lastBehavior = behaviorsOfSameType.length > 0 ? behaviorsOfSameType[0] : null;
    if (lastBehavior && lastBehavior.id === behavior.id) {
      // Add End Time
      const index = newList.findIndex(cb => cb.id === lastBehavior.id);
      newList[index].timeEnded = currentSeconds;
    } 
    else {
      // New Behavior at the beginning of the list
      const codingBehavior = {
        ...behavior,
        timeMarked: currentSeconds
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
    dispatch(saveCoding({
      codingType: 'live',
      exhibitId: selected.id,
      evaluatorId: currentEvaluator.id,
      evaluatorName: `${currentEvaluator?.name} ${currentEvaluator?.lastName}`,
      extraObservations: observations,
      dayStatus: dayStatus,
      visitor: {
        gender: gender.value,
        ageRange: ageRange.value,        
        typeOfGroup: amount.value,
        description: description,
        language: language,
      },
      showFacilitator: showFacilitator,
      facilitator: {
        gender: showFacilitator ? facilitatorGender.value : '',
        ageRange: showFacilitator ? facilitatorAgeRange.value : ''
      },
      codingBehaviors: codingBehaviors
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

  if (!selected || !currentEvaluator) {
    return (
      <div>
        <p>
          No Exhibit selected, or no Evaluator selected.
        </p>
        <a href='/'>Go Back</a>
      </div>
    );
  }

  return (
    <div className="live-coding-container">
      <div className="header-row">Live Coding!! | Exhibit: {selected.name} | Evaluator: {`${currentEvaluator.name} ${currentEvaluator.lastName}`} | <a href='/'>Go Back</a></div>
      <div className="top-half">
        <div className="list-interactions-section">
          <div className="title-row">
            <h2>List of interactions</h2>
            
            {timerStarted ? (
              <div style={{fontSize: '30px'}}>
                {stopWatchToShow}
              </div>
            ) : (
              <div className='timer-button'>
                <button onClick={handleStartTimer}>Start</button>
              </div>
            )}
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
                    {name} <span> {`[${timeRange}]`} </span>
                    - <button onClick={() => removeCoding(codingIndex)}> X </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
        <div className="end-section">
          <div className="nextSteps">
            <button
              onClick={onNewVisitorClicked}
              disabled={savingCoding}
            >
              new visitor
            </button>
            <button
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
                <div className="visitor-behaviors-item">
                  <button disabled={showFacilitator} onClick={handleFacilitatorInteraction}>
                    Facilitator Interaction
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="facilitator-section">
          {showFacilitator && (
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
          )}
        </div>
      </div>
    </div>
  );

}
export default CodingLive;
