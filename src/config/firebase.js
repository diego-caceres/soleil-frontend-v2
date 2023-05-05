import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAx45tUGqxX4qpY21ONDPsYE9-PfCVcinc",
  authDomain: "soleil-92690.firebaseapp.com",
  projectId: "soleil-92690",
  storageBucket: "soleil-92690.appspot.com",
  messagingSenderId: "883829286820",
  appId: "1:883829286820:web:203ff3fb4ef7b9dddd0331",
  measurementId: "G-N5CT5JNWBQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);

export const db = getFirestore(app);