import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AppProvider } from './context/AppContext.jsx';
import { LangProvider } from './context/LangContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LangProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </LangProvider>
  </React.StrictMode>,
);
