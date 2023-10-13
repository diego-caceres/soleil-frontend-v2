import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { Auth } from "../Auth";
import { auth } from "../../config/firebase";
import { AppRoutes } from "./routes";

import { setEvaluator } from "src/redux/exhibits";

export const Router = () => {
  const dispatch = useDispatch();

  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
        const displayName = user.displayName || user.email;
        dispatch(
          setEvaluator({
            name: displayName,
            id: user.uid,
          })
        );
        console.log("User is logged in:", user.email);
      } else {
        setLoggedIn(false);
        dispatch(setEvaluator(null));
        console.log("User is logged out");
      }
    });
  }, []);

  if (loggedIn === true) {
    return <AppRoutes />;
  } else if (loggedIn === false) {
    return <Auth />;
  } else {
    return <div className="loading-screen">Loading...</div>;
  }
};
