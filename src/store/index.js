import { createStore, compose } from "redux";
import rootReducer from "./reducer";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";
import autoMergeLevel1 from "redux-persist/lib/stateReconciler/autoMergeLevel1";
import FilesystemStorage from "redux-persist-filesystem-storage";

const persistConfig = {
  key: "primary",
  storage: FilesystemStorage,
  //stateReconciler: autoMergeLevel1 // see "Merge Process" section for details.
  //blacklist: ["scan"]
  timeout: 0
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export const persistor = persistStore(store);
