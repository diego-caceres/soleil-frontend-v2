import "./CodingStart.scss";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";

import { auth } from "../../config/firebase";
import { selectExhibit, loadExhibits } from "src/redux/exhibits";
import { loadBehaviors } from "src/redux/behaviors";

const CodingStart = () => {
  const displayName =
    auth?.currentUser?.displayName || auth?.currentUser?.email;

  const exhibitsStore = useSelector((state) => state.exhibits);
  const { list: exhibitsList, selectedExhibit } = exhibitsStore;
  const dispatch = useDispatch();

  const [exhibitOptions, setExhibitOptions] = useState([]);

  let currentExhibitOption = null;
  if (selectedExhibit) {
    currentExhibitOption = {
      value: selectedExhibit.id,
      label: selectedExhibit.name,
    };
  }

  // componentDidMount
  useEffect(() => {
    dispatch(loadExhibits());
    dispatch(loadBehaviors());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (exhibitsList && exhibitsList.length > 0) {
      const exhibits = exhibitsList.map((exhibit) => ({
        value: exhibit.id,
        label: exhibit.name,
      }));
      setExhibitOptions(exhibits);
    }
  }, [exhibitsList]);

  // useEffect(() => {
  //   if (evaluators && evaluators.length > 0) {
  //     const evaluatorsAux = evaluators.map(evaluator => ({ value: evaluator.id, label: `${evaluator.name} ${evaluator.lastName}` }));
  //     setEvaluatorOptions(evaluatorsAux);
  //   }
  // }, [evaluators]);

  const handleExhibitChange = ({ value }) => {
    const exhibit = exhibitsList.find((e) => e.id === value);
    if (exhibit) {
      dispatch(selectExhibit({ exhibit }));
    }
  };

  return (
    <div className="container-start">
      <div className="selects-container">
        <p style={{ color: "#FFF" }}>Coder: {displayName}</p>
        <Select
          placeholder="Select exhibit"
          options={exhibitOptions}
          value={currentExhibitOption}
          onChange={handleExhibitChange}
        />
      </div>

      <div className="coding-buttons-container">
        <Link to={selectedExhibit ? "/new-coding-live" : ""}>
          <button className="card" disabled={!selectedExhibit}>
            <div className="card-inner">
              <span className="card-pin"></span>
              <div className="card-content">
                <h2 className="card-title">Live</h2>
              </div>
            </div>
          </button>
        </Link>
        <Link to={selectedExhibit ? "/coding-video" : ""}>
          <button className="card" disabled={!selectedExhibit}>
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
};

export default CodingStart;
