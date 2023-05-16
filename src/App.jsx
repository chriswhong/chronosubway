import React from "react";

import "./App.css";
import Map from "./Map";

function App() {
  return (
    <div className="flex App">
      <div className="ui-container flex-grow flex">
        <div className="flex-grow">
          <Map />
        </div>
      </div>
    </div>
  );
}

export default App;
