
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

export const SessionWrapper = ({ children }) => {

  const handleLogOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button
        className="logoutButton"
        title="Logout"
        onClick={handleLogOut}
      >
        Logout
      </button>
      {children}
    </>
  );
};
