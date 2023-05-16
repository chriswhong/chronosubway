// component for a subway-sign with colored line letters
// based on source code from https://nycguessr.com

function StationHeader(props) {
    const { station } = props;
    return (
      <div className="station-heading">
        <h1 className="station-name">{station.name}</h1>
        <div className="station-lines">
          {station.lines.map((line, i) => {
            return (
              <div
                key={i}
                className={`station-line ${line.lineGroup} ${
                  line.express ? "express" : "local"
                }`}
              >
                <span className="station-line-name">{line.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  export default StationHeader