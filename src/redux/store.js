import { configureStore } from "@reduxjs/toolkit";
import exhibitsReducer from "./exhibits";
import behaviorsReducer from "./behaviors";
import codingsReducer from "./codings";
import interCoderReducer from "./interCoder";

export const store = configureStore({
  reducer: {
    exhibits: exhibitsReducer,
    behaviors: behaviorsReducer,
    codings: codingsReducer,
    interCoders: interCoderReducer,
  },
});
