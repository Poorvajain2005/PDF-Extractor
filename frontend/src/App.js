import React, { useState } from 'react';
import Navbar from './Navbar';
import FileUpload from './FileUpload';
import './App.css';

export const ThemeContext = React.createContext();

function App() {
  const [theme, setTheme] = useState('dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`app ${theme}`}>
        <Navbar />
        <FileUpload />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
