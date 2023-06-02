import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

export const Header = () => {
  const exhibitsStore = useSelector((state) => state.exhibits);
  const { selectedExhibit, currentEvaluator } = exhibitsStore;

  const exhibitName = selectedExhibit?.name || "Not selected yet";

  const handleLogOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="header-row">
      <div>
        Exhibit: {exhibitName} | Evaluator: {currentEvaluator?.name} |{" "}
        <a href="/">Go Back</a>
      </div>
      <div>
        <button className="logoutButton" title="Logout" onClick={handleLogOut}>
          Logout
        </button>
      </div>
    </div>
  );
};
