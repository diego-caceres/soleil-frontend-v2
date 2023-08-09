import { createSlice } from "@reduxjs/toolkit";

import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";

const initialState = {
  videoNames: [],
  selectedVideo: null,
  videoCodings: [],
};

export const interCodersSlice = createSlice({
  name: "interCoders",
  initialState,
  reducers: {
    setVideoNames: (state, action) => {
      const { videoNames } = action.payload;
      videoNames.sort((a, b) => (a > b ? 1 : -1));
      state.videoNames = videoNames;
    },
    setSelectedVideo: (state, action) => {
      const { videoName } = action.payload;
      state.selectedVideo = videoName;
    },
    setVideoCodings: (state, action) => {
      const { codings } = action.payload;
      state.videoCodings = codings;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setVideoNames, setSelectedVideo, setVideoCodings } =
  interCodersSlice.actions;

export default interCodersSlice.reducer;

export const loadVideoNames = () => {
  return async (dispatch) => {
    const codingsCollectionRef = collection(db, "codings");
    const data = await getDocs(codingsCollectionRef);
    const filteredCodingsData = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    let videoNames = [];
    debugger;
    filteredCodingsData.forEach((coding) => {
      if (!videoNames.includes(coding.videoName)) {
        videoNames.push(coding.videoName);
      }
    });

    if (videoNames.length) {
      dispatch(setVideoNames({ videoNames }));
    }
  };
};

// export const loadBehaviorsForVisitor = () => {
//   return (dispatch) => {
//     fetch(`${baseUrl}/behaviors?forVisitors=true`, {
//       method: 'GET'
//     })
//     .then(response => response.json())
//     .then(behaviors => {
//       if (behaviors.length) {
//         dispatch(setBehaviorsForVisitor({ forVisitor: behaviors }));
//       }
//     });
//   };
// };

// export const loadBehaviorsForFacilitator = () => {
//   return (dispatch) => {
//     fetch(`${baseUrl}/behaviors?forFacilitators=true`, {
//       method: 'GET'
//     })
//     .then(response => response.json())
//     .then(behaviors => {
//       if (behaviors.length) {

//         dispatch(setBehaviorsForFacilitator({ forFacilitator: behaviors }));
//       }
//     });
//   };
// };
