import { createSlice } from '@reduxjs/toolkit'
import { baseUrl } from 'src/constants';

const initialState = {
  list: [],
  selected: null,
  evaluators: [],
  currentEvaluator: null,
  currentExhibitVideos: [],
  currentExhibitCodings: [],
  selectedVideo: null,
}

export const exhibitsSlice = createSlice({
  name: 'exhibits',
  initialState,
  reducers: {
    setExhibitList: (state, action) => {
      const { exhibits } = action.payload;
      state.list = exhibits
    },
    selectExhibit: (state, action) => {
      const { exhibit } = action.payload;
      state.selected = exhibit
    },
    setEvaluatorsList: (state, action) => {
      const { evaluators } = action.payload;
      state.evaluators = evaluators
    },
    selectEvaluator: (state, action) => {
      const { evaluator } = action.payload;
      state.currentEvaluator = evaluator
    },
    setCurrentExhibitVideosList: (state, action) => {
      const { exhibitVideos } = action.payload;
      state.currentExhibitVideos = exhibitVideos
    },
    selectVideo: (state, action) => {
      const { video } = action.payload;
      state.selectedVideo = video
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setExhibitList,
  selectExhibit,
  setEvaluatorsList,
  selectEvaluator,
  setCurrentExhibitVideosList,
  selectVideo
} = exhibitsSlice.actions

export default exhibitsSlice.reducer

export const loadExhibits = () => {
  return (dispatch) => {
    fetch(`${baseUrl}/exhibits`, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(exhibits => {
      if (exhibits.length) {
        dispatch(setExhibitList({ exhibits: exhibits }));
      }
    });
  };
};

export const loadEvaluators = (center) => {
  return (dispatch) => {
    fetch(`${baseUrl}/evaluators?center=${center}`, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(evaluators => {
      if (evaluators.length) {
        dispatch(setEvaluatorsList({ evaluators: evaluators }));
      }
    });
  };
};

export const loadExhibitInfo = (exhibitId) => {
  return (dispatch) => {
    fetch(`${baseUrl}/exhibitvideos?exhibitId=${exhibitId}`, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(exhibitVideos => {
      if (exhibitVideos.length) {
        dispatch(setCurrentExhibitVideosList({ exhibitVideos: exhibitVideos }));
      }
    });
  };
}