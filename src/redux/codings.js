import { createSlice } from "@reduxjs/toolkit";
import { addDoc, collection } from "firebase/firestore";
import { baseUrl } from "src/constants";
import { db } from "../config/firebase";

const initialState = {
  savingCoding: false,
};

export const codingsSlice = createSlice({
  name: "codings",
  initialState,
  reducers: {
    toggleSavingCoding: (state) => {
      state.savingCoding = !state.savingCoding;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleSavingCoding } = codingsSlice.actions;

export default codingsSlice.reducer;

export const saveCoding = (codingToSave, callback) => {
  return async (dispatch) => {
    try {
      dispatch(toggleSavingCoding());
      const codingsCollectionRef = collection(db, "codings");
      const codingData = {
        codingType: codingToSave.codingType,
        exhibitId: codingToSave.exhibitId,
        evaluatorId: codingToSave.evaluatorId,
        evaluatorName: codingToSave.evaluatorName,
        extraObservations: codingToSave.extraObservations,
        dayStatus: codingToSave.dayStatus,
        visitor: codingToSave.visitor,
        showFacilitator: codingToSave.showFacilitator,
        facilitator: codingToSave.facilitator,
        codingBehaviors: codingToSave.codingBehaviors,
        videoName: codingToSave.videoName,
        videoDuration: codingToSave.videoDuration,
        codedDate: new Date(),
      };
      const coding = await addDoc(codingsCollectionRef, codingData);
      if (coding.id) {
        if (callback) {
          callback("The coding was saved successfully", true);
        }
      } else {
        if (callback) {
          callback("There was an error: " + coding.message, false);
        }
      }
      dispatch(toggleSavingCoding());
    } catch (err) {
      console.error(err);
    }

    // const data = {
    //   ...codingToSave
    // }

    // fetch(`${baseUrl}/codings`, {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    // .then(response => response.json())
    // .then(coding => {
    //   if (coding.id) {
    //     if (callback) {
    //       callback('The coding was saved successfully', true);
    //     }
    //   } else {
    //     if (callback) {
    //       callback('There was an error: ' + coding.message, false);
    //     }
    //   }
    // })
    // .finally(() => {
    //   dispatch(toggleSavingCoding());
    // });
  };
};
