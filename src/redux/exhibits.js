import { createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "src/constants";

import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";

const initialState = {
  list: [],
  selectedExhibit: null,
  currentEvaluator: null,
  currentExhibitVideos: [],
  currentExhibitCodings: [],
  selectedVideo: null,
};

export const exhibitsSlice = createSlice({
  name: "exhibits",
  initialState,
  reducers: {
    setExhibitList: (state, action) => {
      const { exhibits } = action.payload;
      state.list = exhibits;
    },
    selectExhibit: (state, action) => {
      const { exhibit } = action.payload;
      state.selectedExhibit = exhibit;
    },
    setEvaluator: (state, action) => {
      const evaluator = action.payload;
      state.currentEvaluator = evaluator;
    },
    setCurrentExhibitVideosList: (state, action) => {
      const { exhibitVideos } = action.payload;
      state.currentExhibitVideos = exhibitVideos;
    },
    selectVideo: (state, action) => {
      const { video } = action.payload;
      state.selectedVideo = video;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setExhibitList,
  selectExhibit,
  setEvaluator,
  setCurrentExhibitVideosList,
  selectVideo,
} = exhibitsSlice.actions;

export default exhibitsSlice.reducer;

export const loadExhibits = () => {
  return async (dispatch) => {
    const exhibitsCollectionRef = collection(db, "exhibits");
    const data = await getDocs(exhibitsCollectionRef);
    const filteredData = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    dispatch(setExhibitList({ exhibits: filteredData }));

    // fetch(`${baseUrl}/exhibits`, {
    //   method: 'GET'
    // })
    // .then(response => response.json())
    // .then(exhibits => {
    //   if (exhibits.length) {
    //     dispatch(setExhibitList({ exhibits: exhibits }));
    //   }
    // });
  };
};

export const loadExhibitInfo = (exhibitId) => {
  return (dispatch) => {
    fetch(`${baseUrl}/exhibitvideos?exhibitId=${exhibitId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((exhibitVideos) => {
        if (exhibitVideos.length) {
          dispatch(
            setCurrentExhibitVideosList({ exhibitVideos: exhibitVideos })
          );
        }
      });
  };
};
