import { useState } from "react";
import { useDispatch } from "react-redux";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../../config/firebase";
import { setEvaluator } from "src/redux/exhibits";

import SoleilLogo from "src/components/SoleilLogo";

import { createExibits } from "src/seeds/exhibits";
import { createBehaviors } from "src/seeds/behaviors";

import "./auth.css";

export const Auth = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLoginIn = async () => {
    setError("");
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const displayName = user.displayName || user.email;

      dispatch(
        setEvaluator({
          name: displayName,
          id: user.uid,
        })
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="loginWrapper">
      <SoleilLogo />
      <input
        type="text"
        placeholder="Email.."
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password.."
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="login-btn" onClick={handleLoginIn}>
        Login
      </button>

      <div className="errorWrapper">{error && <p>{error}</p>}</div>
    </div>
  );
};

export const SeedComponent = () => {
  const handleExhibitsCreation = async () => {
    await createExibits();
  };

  const handleBehaviorsCreation = async () => {
    await createBehaviors();
  };

  return (
    <div>
      <button onClick={handleExhibitsCreation}>Create Exhibits</button>
      <button onClick={handleBehaviorsCreation}>Create Behaviors</button>
    </div>
  );
};
