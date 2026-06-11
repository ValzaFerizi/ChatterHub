import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import axios from 'axios';

axios.get('http://localhost:5000/api/settings').then(res => {
  if (res.data.primary_color) {
    document.documentElement.style.setProperty('--primary-color', res.data.primary_color);
  }
}).catch(() => {});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);