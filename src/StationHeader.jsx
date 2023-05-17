// component for a subway-sign with colored line letters
// based on source code from https://nycguessr.com

import React from "react";

function StationHeader(props) {
  const { station } = props;
  return (
    <div className="station-heading">
      <h1 className="station-name">{station.name}</h1>
      <div className="station-lines">
        {station.lines.map((line) => (
          <div
            key={`${line.name}-${line.lineGroup}-${line.express}`}
            className={`station-line box-content ${line.lineGroup} ${
              line.express ? "express" : "local"
            }`}
          >
            <span className="station-line-name">{line.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StationHeader;
