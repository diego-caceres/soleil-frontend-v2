import './CodingVideo.scss';
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ReactPlayer from 'react-player'

import { loadBehaviorsForFacilitator, loadBehaviorsForVisitor } from 'src/redux/behaviors'
import { saveCoding } from 'src/redux/codings';
import { toHHMMSS } from 'src/utils';

// const videoURL = 'https://rr6---sn-x1x7zn7e.c.drive.google.com/videoplayback?expire=1636077174&ei=NVaEYbeFPNv1u7APib64oAU&ip=190.134.235.148&cp=QVRIWEFfVlFVRVhPOkl5OG5sYllZb19uc3htVGFtYWpXSjl5TGQ0V0RPekYxdXFpbVk2SnZ5TEQ&id=9d21bbc61defbd6c&itag=18&source=webdrive&requiressl=yes&mh=Cu&mm=32&mn=sn-x1x7zn7e&ms=su&mv=u&mvi=6&pl=21&ttl=transient&susc=dr&driveid=1plI9iaKaIiy3rZzHAk-oKMU1pWb9tCKT&app=explorer&mime=video/mp4&vprv=1&prv=1&dur=22.755&lmt=1634857893598685&mt=1636061035&sparams=expire,ei,ip,cp,id,itag,source,requiressl,ttl,susc,driveid,app,mime,vprv,prv,dur,lmt&sig=AOq0QJ8wRAIgFZ8ca7tc_CbgvySB7BKakjrVEfoV_U0EsGu2SosB7vICIANBkibIF80T0SdLIxz4ub7GTHbDLNUmYVGW-78aHdZx&lsparams=mh,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRQIhAL0AYbtxRux_svZxcKdmuBnXfSRou2QhfT1aDCgGSjbQAiAUMLwUMYtcOvuQtAA6XDMU9qYYx5aflDEw_1aye0kDQg==&cpn=FI_VBZ88GWDMGhpY&c=WEB_EMBEDDED_PLAYER&cver=1.20211031.00.00';
// const videoURL = 'https://www.youtube.com/watch?v=Yq-Kfc81h5s';

const CodingVideo = () => {
  const [codingBehaviors, setCodingBehaviors] = useState([]);
  const [showFacilitator, setShowFacilitator] = useState(false);
  const [gender, setGender] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const [facilitatorGender, setFacilitatorGender] = useState('');
  const [facilitatorAgeRange, setFacilitatorAgeRange] = useState('');

  const exhibitsStore = useSelector((state) => state.exhibits);
  const { selected, currentEvaluator, selectedVideo } = exhibitsStore;
  const behaviorsStore = useSelector((state) => state.behaviors);
  const { visitorBehaviors, facilitatorBehaviors } = behaviorsStore;
  const codingsStore = useSelector((state) => state.codings);
  const { savingCoding } = codingsStore;


  const dispatch = useDispatch()
  const playerRef = useRef();


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

  const handleFacilitatorInteraction = () => {
    setShowFacilitator(true);
  }

  const onGenderSelected = (value) => {
    setGender(value)
  }

  const onPhotoClicked = () => {
    const seconds = getVideoTimeInSeconds();
    const photobehavior = {
      name: 'Visitor took a photo!',
      forVisitor: true,
      timeMarked: seconds
    }
    const newList = [
      photobehavior,
      ...codingBehaviors,
    ]
    setCodingBehaviors(newList);
  }

  const addBehaviorToCoding = (behavior) => {
    const seconds = getVideoTimeInSeconds();
    let newList = [
      ...codingBehaviors,
    ]
    // If it is the same as the last behavior added, it is the end time
    const lastBehavior = codingBehaviors.length > 0 ? codingBehaviors[0] : null;
    if (lastBehavior && lastBehavior.id === behavior.id) {
      // Add End Time
      newList[0].timeEnded = seconds;
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
      alert('Debes agregar al menos un comportamiento!');
      return false;
    }

    if (gender.length === 0) {
      alert('Debes indicar el género del visitante!');
      return false;
    }

    if (ageRange.length === 0) {
      alert('Debes indicar la edad del visitante!');
      return false;
    }

    if (amount.length === 0) {
      alert('Debes indicar la cantidad de visitantes!');
      return false;
    }

    if (showFacilitator) {
      if (facilitatorGender.length === 0) {
        alert('Debes indicar el género del facilitador!');
        return false;
      }
  
      if (facilitatorAgeRange.length === 0) {
        alert('Debes indicar la edad del facilitador!');
        return false;
      }
    }

    return true;
  }

  const onNewVisitorClicked = () => {
    if (validateFields()) {
      dispatch(saveCoding({
        codingType: 'video',
        exhibitId: selected.id,
        evaluatorName: `${currentEvaluator?.name} ${currentEvaluator?.lastName}`,
        visitor: {
          gender: gender,
          ageRange: ageRange,        
          typeOfGroup: amount,
          description: description      
        },
        facilitator: {
          gender: facilitatorGender,
          ageRange: facilitatorAgeRange    
        },
        codingBehaviors: codingBehaviors
      }, (message) => {
        alert(message);
      }));
    }
  }

  const onEndClicked = () => {
    if (validateFields()) {
      
    }
  }

  const videoURL = selectedVideo?.url;

  return (
    <div className="container-video">
      <div className="video">
        <div div>Selected Exhibit: {selected.name}</div>
        <div div>Selected Coder: {currentEvaluator?.name} {currentEvaluator?.lastName}</div>

        <ReactPlayer
          url={videoURL}
          ref={playerRef}
          controls
        />
        
      </div>

      <div className="belowVideo">
        <div className="obs">
          <input type="text" placeholder="observations" />
        </div>
        <div className="codingList">
          <h2>Lista de interacciones:</h2>
          {codingBehaviors.length === 0
          ? (
            <p>No hay interacciones agregadas aún</p>
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
      </div>

      <div className="coding">
        <div className="visitor">
          <div className="visitorDemographics">
            <div>
              <button
                onClick={() => onGenderSelected('female')}
                style={gender === 'female' ? { border: '1px solid red' } : {}}
              >
                Female
              </button>
              <button
                onClick={() => onGenderSelected('male')}
                style={gender === 'male' ? { border: '1px solid red' } : {}}
              >
                Male
              </button>
            </div>
            <div>
              <button
                onClick={() => setAgeRange('teen')}
                style={ageRange === 'teen' ? { border: '1px solid red' } : {}}
              >
                Teen
              </button>
              <button
                onClick={() => setAgeRange('youngAdult')}
                style={ageRange === 'youngAdult' ? { border: '1px solid red' } : {}}
              >
                Young adult
              </button>
              <button
                onClick={() => setAgeRange('adult')}
                style={ageRange === 'adult' ? { border: '1px solid red' } : {}}
              >
                Adult              
              </button>
              <button
                onClick={() => setAgeRange('senior')}
                style={ageRange === 'senior' ? { border: '1px solid red' } : {}}
              >
                Senior
              </button>
            </div>
            <div>
              <button
                onClick={() => setAmount('alone')}
                style={amount === 'alone' ? { border: '1px solid red' } : {}}
              >
                Alone
              </button>
              <button
                onClick={() => setAmount('2people')}
                style={amount === '2people' ? { border: '1px solid red' } : {}}
              >
                2 people
              </button>
              <button
                onClick={() => setAmount('3+people')}
                style={amount === '3+people' ? { border: '1px solid red' } : {}}
              >
                3+ people
              </button>
            </div>

          </div>
        
          <div className="vbfl">
            {visitorBehaviors.map(behavior => {
              const { name } = behavior;
              return (
                <button
                  key={name}
                  onClick={() => addBehaviorToCoding(behavior)}
                >
                  {name}
                </button>
              );
            })}            
          </div>
          <div className="other">
            <button disabled={showFacilitator} onClick={handleFacilitatorInteraction}>
              facilitator interaction
            </button>
            <input
              value={description}
              onChange={(e) => setDescription(e.value.target)}
              type="text"
              placeholder="visitor description" />
          </div>
        </div>
        
        {showFacilitator && (
          <div className="facilitator">
            <div>
              <button
                onClick={() => setFacilitatorGender('female')}
                style={facilitatorGender === 'female' ? { border: '1px solid red' } : {}}
              >
                Female
              </button>
              <button
                onClick={() => setFacilitatorGender('male')}
                style={facilitatorGender === 'male' ? { border: '1px solid red' } : {}}
              >
                Male
              </button>
            </div>
            <div>
              <button
                onClick={() => setFacilitatorAgeRange('teen')}
                style={facilitatorAgeRange === 'teen' ? { border: '1px solid red' } : {}}
              >
                Teen
              </button>
              <button
                onClick={() => setFacilitatorAgeRange('youngAdult')}
                style={facilitatorAgeRange === 'youngAdult' ? { border: '1px solid red' } : {}}
              >
                Young adult
              </button>
              <button
                onClick={() => setFacilitatorAgeRange('adult')}
                style={facilitatorAgeRange === 'adult' ? { border: '1px solid red' } : {}}
              >
                Adult              
              </button>
              <button
                onClick={() => setFacilitatorAgeRange('senior')}
                style={facilitatorAgeRange === 'senior' ? { border: '1px solid red' } : {}}
              >
                Senior
              </button>
            </div>
            <div className="comfort">
              {confortBehaviors.map(behavior => {
                const { name } = behavior;
                return (
                  <button
                    key={name}
                    onClick={() => addBehaviorToCoding(behavior)}
                  >
                    {name}
                  </button>
                );
              })} 
            </div>
            <div className="reflection">
              {reflectionBehaviors.map(behavior => {
                const { name } = behavior;
                return (
                  <button
                    key={name}
                    onClick={() => addBehaviorToCoding(behavior)}
                  >
                    {name}
                  </button>
                );
              })} 
            </div>
            <div className="exhibitUse">
              {exhibitUseBehaviors.map(behavior => {
                const { name } = behavior;
                return (
                  <button
                    key={name}
                    onClick={() => addBehaviorToCoding(behavior)}
                  >
                    {name}
                  </button>
                );
              })} 
            </div>
            <div className="information">
              {informationBehaviors.map(behavior => {
                const { name } = behavior;
                return (
                  <button
                    key={name}
                    onClick={() => addBehaviorToCoding(behavior)}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

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
      <div className="footer">
        <p>(C) Sole is awesome, 2021</p>
      </div>
    </div>
  );
}

export default CodingVideo;
