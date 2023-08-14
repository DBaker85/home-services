import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "@fontsource/roboto/300.css";

import { store } from "./store";
import App from "./App.tsx";
import { CssBaseline } from "@mui/material";

import { ThemeOptions, ThemeProvider, createTheme } from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#b894a6",
    },
    secondary: {
      main: "#5c4785",
    },
    background: {
      default: "#141414",
    },
    text: {
      primary: "#f7f7f7",
    },
    error: {
      main: "#bc3b2f",
    },
  },
};

const theme = createTheme(themeOptions);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CssBaseline />
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
