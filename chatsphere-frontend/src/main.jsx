import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 🔥 IMPORT ALL STYLES HERE
import "./styles/global.css";
import "./styles/theme.css";
import "./styles/chat.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
