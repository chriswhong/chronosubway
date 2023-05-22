import React from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import Map from "./Map";

function App() {
  return (
    <Routes>
      <Route
        element={
          <div className="flex App">
            <div className="ui-container flex-grow flex">
              <div className="flex-grow">
                <Map />
              </div>
            </div>
          </div>
        }
      >
        <Route index />
        <Route path="/stop/:id/:name" />
      </Route>
    </Routes>
  );
}

export default App;
