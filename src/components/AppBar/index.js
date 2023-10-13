import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useLocation } from "react-router-dom";
import "./appbar.css";

export const AppBar = () => {
  const location = useLocation();
  const exhibitsStore = useSelector((state) => state.exhibits);
  const { selectedExhibit, currentEvaluator } = exhibitsStore;

  const exhibitName = selectedExhibit?.name || "Not selected yet";

  const handleGoBack = () => {
    window.history.back();
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  const showGoBack = location.pathname !== "/";
  const showInfo = location.pathname !== "/";

  return (
    <div className="appBar-row">
      <div>
        {showGoBack && (
          <div className="appBar-goback">
            <div className="soleil-logo-small"></div>
            <button
              className="goback-btn"
              onClick={handleGoBack}
            >{`< Go Back`}</button>
          </div>
        )}
      </div>
      <div className="appBar-info">
        <div>
          {showInfo && (
            <div className="appBar-text">
              <span className="appBar-exhibit">{exhibitName}</span>
              <span className="appBar-evaluator">
                Evaluator: {currentEvaluator?.name}
              </span>
            </div>
          )}
        </div>
        <div>
          <button
            className="logoutButton"
            title="Logout"
            onClick={handleLogOut}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
