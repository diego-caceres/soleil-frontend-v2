import "./CodingStart.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { auth } from "../../config/firebase";
import { SelectExhibit } from "../SelectExhibit";

const CodingStart = () => {
  const displayName =
    auth?.currentUser?.displayName || auth?.currentUser?.email;

  const exhibitsStore = useSelector((state) => state.exhibits);
  const { selectedExhibit } = exhibitsStore;

  return (
    <div className="container-start">
      <p style={{ color: "#FFF" }}>Coder: {displayName}</p>
      <SelectExhibit />
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
