import React, { useContext } from 'react';
import { ThemeContext } from './App';

const Navbar = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <header className="navbar">
      <div className="nav-left">
        <div className="brand">Extractor<span className="dot">.AI</span></div>
      </div>
      <div className="nav-right">
        <div className="logo-placeholder">PJ</div>
        <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
