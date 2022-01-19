import { configureStore } from '@reduxjs/toolkit'
import exhibitsReducer from './exhibits'
import behaviorsReducer from './behaviors'
import codingsReducer from './codings'

export const store = configureStore({
  reducer: {
    exhibits: exhibitsReducer,
    behaviors: behaviorsReducer,
    codings: codingsReducer
  },
})