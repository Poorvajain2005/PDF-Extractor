import React from "react";

const Navbar = ({ isDark, setIsDark }) => {
  return (
    <nav className="navbar">
      <div className="logo-section">
        <div className="logo-circle">Made By Poorva</div>
        <h1 className="logo-text">
          Extractor<span>.AI</span>
        
        </h1>
      </div>
     
    </nav>
  );
};

export default Navbar;
