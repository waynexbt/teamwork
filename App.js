import { SafeAreaView } from "react-native-safe-area-context";
import AppNavigation from "./navigations/AppNavigation";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import rootReducer from "./stores/rootReducer";
import { persistStore, persistReducer } from "redux-persist";
import Toast from "react-native-toast-message";
import "./translation";
import i18n from "./translation";
import 'react-native-gesture-handler';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

const App = () => {
  return (
    <BottomSheetModalProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigation />
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </PersistGate>
    </Provider>
    </BottomSheetModalProvider>
  );
};

export default App;
