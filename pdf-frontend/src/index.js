import React from 'react';
import ReactDOM from 'react-dom/client';
// Use the precompiled Tailwind CSS output to avoid CRA PostCSS loader issues
// Tailwind CSS is loaded from public/tailwind.output.css (precompiled)
// to avoid CRA's PostCSS loader PATH that was causing plugin errors.
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
