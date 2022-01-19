import './CodingStart.scss';
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';

import { selectExhibit, loadExhibits, loadEvaluators, selectEvaluator } from 'src/redux/exhibits'

const CodingStart = () => {
  const exhibitsStore = useSelector((state) => state.exhibits);
  const { list: exhibits, selected, evaluators, currentEvaluator } = exhibitsStore;
  const dispatch = useDispatch()

  // componentDidMount
  useEffect(() => {
    dispatch(loadExhibits());
  }, []);

  const handleExhibitChange = (event) => {
    const { value } = event.target;
    
    const exhibit = exhibits.find(e => e.name === value);
    if (exhibit) {
      dispatch(selectExhibit({ exhibit }));
      dispatch(loadEvaluators(exhibit.center))
    }
  }

  const handleEvaluatorChange = (event) => {
    const { value } = event.target;

    const evaluator = evaluators.find(e => e.name === value);
    dispatch(selectEvaluator({ evaluator }));
  }

  return (
    <div className="container-start">
      <section className="title">
        <h1>Get in loser, we're going coding ✌️</h1>
      </section>
      
      <section className="search">
        <div className="search-inner">
          <button className="search-button">
            <p>Exhibit</p>
          </button>
          {/* <!-- esto viene de una lista que se pre carga --> */}
          <input list="exhibits" type="text" className="search-input" placeholder="Search..." onChange={handleExhibitChange} />
          <datalist id="exhibits">
            {exhibits.map(exhibit => {
              return (
                <option key={exhibit.id} value={exhibit.name} />
              )
            })}
          </datalist>
          {/* <Select className="search-input" options={options} /> */}
        </div>
      </section>
      <section className="search">
        <div className="search-inner">
          <button className="search-button">
            <p>Coder</p>
          </button>
          {/* <!-- esto viene de una lista que se pre carga --> */}
          <input list="evaluators" type="text" className="search-input" placeholder="Search..." onChange={handleEvaluatorChange} />
          <datalist id="evaluators">
            {evaluators.map(evaluator => {
              return (
                <option key={evaluator.id} value={evaluator.name} />
              )
            })}
          </datalist>
        </div>
      </section>

      <section className="options">
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
        <Link to={selected && currentEvaluator ? '/new-coding-video' : ''} >
          <button className="card" disabled={!selected || !currentEvaluator}>
            <div className="card-inner">
              <span className="card-pin"></span>
              <div className="card-content">
                <h2 className="card-title">Video</h2> 
              </div>
            </div>
          </button>
        </Link>
      </section>
    </div>
  );
}

export default CodingStart;
