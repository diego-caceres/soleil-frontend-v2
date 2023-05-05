import { createSlice } from "@reduxjs/toolkit";

import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";

const initialState = {
  visitorBehaviors: [],
  facilitatorBehaviors: [],
};

export const behaviorsSlice = createSlice({
  name: "behaviors",
  initialState,
  reducers: {
    setBehaviorsForVisitor: (state, action) => {
      const { forVisitor } = action.payload;
      forVisitor.sort((a, b) => (a.name > b.name ? 1 : -1));
      state.visitorBehaviors = forVisitor;
    },
    setBehaviorsForFacilitator: (state, action) => {
      const { forFacilitator } = action.payload;
      state.facilitatorBehaviors = forFacilitator;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setBehaviorsForVisitor, setBehaviorsForFacilitator } =
  behaviorsSlice.actions;

export default behaviorsSlice.reducer;

export const loadBehaviors = () => {
  return async (dispatch) => {
    const behaviorsCollectionRef = collection(db, "behaviors");
    const data = await getDocs(behaviorsCollectionRef);
    const filteredData = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const visitorBehaviors = filteredData.filter(
      (behavior) => behavior.forVisitor
    );
    const facilitatorBehaviors = filteredData.filter(
      (behavior) => behavior.forFacilitator
    );
    if (visitorBehaviors.length) {
      dispatch(setBehaviorsForVisitor({ forVisitor: visitorBehaviors }));
    }
    if (facilitatorBehaviors.length) {
      dispatch(
        setBehaviorsForFacilitator({ forFacilitator: facilitatorBehaviors })
      );
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
