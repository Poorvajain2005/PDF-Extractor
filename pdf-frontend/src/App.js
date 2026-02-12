import React, { useState } from "react";
import Navbar from "./Navbar";
import FileUpload from "./FileUpload";
import "./App.css";

function App() {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={`app ${isDark ? "dark" : "light"}`}>
      <Navbar isDark={isDark} setIsDark={setIsDark} />
      <FileUpload isDark={isDark} />
    </div>
  );
}

export default App;
