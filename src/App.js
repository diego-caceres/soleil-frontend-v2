// import { useEffect, useState } from "react";

import { Router } from "./components/Router";

// import { db } from "./config/firebase";
// import { getDocs, collection } from "firebase/firestore";

function App() {
  // const [movies, setMovies] = useState([]);

  // const moviesCollectionRef = collection(db, "movies");

  // useEffect(() => {
  //   const getMoviesList = async () => {
  //     try {
  //       const data = await getDocs(moviesCollectionRef);
  //       const filteredData = data.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       console.log("filteredData", filteredData);
  //       setMovies(filteredData);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   getMoviesList();
  // }, []);

  return (
    <div className="App">
      <Router />

      {/* <div>
        {movies.map(movie => (
          <div key={movie.id}>
            <h2 style={{ color: movie.receivedAnOscar ? 'green' : 'red' }}>{movie.title}</h2>
            <p>Date: {movie.releaseDate}</p>
          </div>
        ))}
      </div>*/}
    </div>
  );
}

export default App;
