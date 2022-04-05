import './CodingStart.scss';
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import Select from 'react-select';


import { selectExhibit, loadExhibits, loadEvaluators, selectEvaluator } from 'src/redux/exhibits'

const CodingStart = () => {
  const exhibitsStore = useSelector((state) => state.exhibits);
  const { list: exhibitsList, selected, evaluators, currentEvaluator } = exhibitsStore;
  const dispatch = useDispatch()
  
  const [exhibitOptions, setExhibitOptions] = useState([]);
  const [evaluatorOptions, setEvaluatorOptions] = useState([]);

  let currentExhibitOption = null;
  if (selected) {
    currentExhibitOption = {
      value: selected.id,
      label: selected.name
    }
  }

  let currentEvaluatorOption = null;
  if (currentEvaluator) {
    currentEvaluatorOption = {
      value: currentEvaluator.id,
      label: `${currentEvaluator.name} ${currentEvaluator.lastName}`
    }
  }

  // componentDidMount
  useEffect(() => {
    dispatch(loadExhibits());
  }, []);

  useEffect(() => {
    if (exhibitsList && exhibitsList.length > 0) {
      const exhibits = exhibitsList.map(exhibit => ({ value: exhibit.id, label: exhibit.name }));
      setExhibitOptions(exhibits);
    }
  }, [exhibitsList]);

  useEffect(() => {
    if (evaluators && evaluators.length > 0) {
      const evaluatorsAux = evaluators.map(evaluator => ({ value: evaluator.id, label: `${evaluator.name} ${evaluator.lastName}` }));
      setEvaluatorOptions(evaluatorsAux);
    }
  }, [evaluators]);

  const handleExhibitChange = ({ value }) => {
    const exhibit = exhibitsList.find(e => e.id === value);
    if (exhibit) {
      dispatch(selectExhibit({ exhibit }));
      dispatch(loadEvaluators(exhibit.center))
    }
  }

  const handleEvaluatorChange = ({ value }) => {
    const evaluator = evaluators.find(e => e.id === value);
    if (evaluator) {
      dispatch(selectEvaluator({ evaluator }));
    }
    // const { value } = event.target;

    // const evaluator = evaluators.find(e => e.name === value);
    // dispatch(selectEvaluator({ evaluator }));
  }

  return (
    <div className="container-start">

      <div className="selects-container">
        <Select
          placeholder="Select exhibit"
          options={exhibitOptions}
          value={currentExhibitOption}
          onChange={handleExhibitChange}
        />

        <Select
          placeholder="Select coder"
          options={evaluatorOptions}
          value={currentEvaluatorOption}
          onChange={handleEvaluatorChange}
        />
      </div>

      <div className='coding-buttons-container'>
        <Link to={selected ? '/new-coding-live' : ''}>
            <button className="card" disabled={!selected || !currentEvaluator}>
              <div className="card-inner">
                <span className="card-pin"></span>
                <div className="card-content">
                  <h2 className="card-title">Live</h2>
                </div>
              </div>
            </button>
          </Link>
          <Link to={selected && currentEvaluator ? '/coding-video' : ''} >
            <button className="card" disabled={!selected || !currentEvaluator}>
              <div className="card-inner">
                <span className="card-pin"></span>
                <div className="card-content">
                  <h2 className="card-title">Video</h2> 
                </div>
              </div>
            </button>
          </Link>
      </div>
    </div>
  );
}

export default CodingStart;
