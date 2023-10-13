import "./CodingStart.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import SoleilLogo from "src/components/SoleilLogo";
import { SelectExhibit } from "../SelectExhibit";

const CodingStart = () => {
  const navigate = useNavigate();
  const displayName =
    auth?.currentUser?.displayName || auth?.currentUser?.email;

  const exhibitsStore = useSelector((state) => state.exhibits);
  const { selectedExhibit } = exhibitsStore;

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <div className="container-start">
      <SoleilLogo />

      <span className="welcome-text">Hello {displayName}</span>
      <SelectExhibit />

      <div className="buttons-container">
        <button
          onClick={() => navigate("/new-coding-live")}
          className="live-coding-btn"
        >
          Live coding
        </button>
        <button
          onClick={() => navigate("/coding-video")}
          className="video-coding-btn"
        >
          Video coding
        </button>
        <button onClick={() => navigate("/grafica")} className="vep-btn">
          VEP
        </button>
        <button onClick={() => navigate("/inter-coder")} className="inter-btn">
          Inter-rater reliability
        </button>
      </div>

      {/* <Link to="/codings">
        <div>Codings List</div>
      </Link> */}
    </div>
  );
};

export default CodingStart;
