import { createSlice } from '@reduxjs/toolkit'
import { baseUrl } from 'src/constants';

const initialState = {
  savingCoding: false,
}

export const codingsSlice = createSlice({
  name: 'codings',
  initialState,
  reducers: {
    toggleSavingCoding: (state) => {
      state.savingCoding = !state.savingCoding
    }
  },
})

// Action creators are generated for each case reducer function
export const { toggleSavingCoding } = codingsSlice.actions

export default codingsSlice.reducer

export const saveCoding = (codingToSave, callback) => {
  return (dispatch) => {

    dispatch(toggleSavingCoding());

    const data = {
      ...codingToSave
    }


    fetch(`${baseUrl}/codings`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(coding => {
      debugger
      if (coding.id) {
        if (callback) {
          callback('El coding se guardó con éxito');
        }
      } else {
        if (callback) {
          callback('Ocurrió un error: ' + coding.message);
        }
      }
    })
    .finally(() => {
      dispatch(toggleSavingCoding());
    });
  };
};
