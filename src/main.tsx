import React from "react";
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter basename={process.env.REACT_APP_URI}>
      <App />
    </HashRouter>
  </React.StrictMode>
)