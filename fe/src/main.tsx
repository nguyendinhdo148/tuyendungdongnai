import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import axios from "axios";
import { setUser } from "./redux/authSlice";

let hasLoggedOut = false;
const logoutDueAuthFailure = async () => {
  if (hasLoggedOut) return;
  hasLoggedOut = true;
  store.dispatch(setUser(null));
  await persistor.purge();
  window.localStorage.removeItem("persist:root");
  window.location.href = "/login";
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        logoutDueAuthFailure();
      }
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
