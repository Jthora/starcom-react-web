import './App.css';
import Globe from 'react-globe.gl';
import React from 'react'
import { useEffect, useState } from "react";

import globeImageUrl from "./assets/earthmap1k.jpeg";
//import bumpImageUrl from "./assets/earthbump1k.jpeg";

function World () {
  const [countries, setCountries] = useState({ features: [] });

  useEffect(() => {
    // load data
    fetch("./data/ne_110m_admin_0_countries.geojson") // Correct the path here
      .then(res => res.json())
      .then(setCountries);
  }, []);

  return <Globe
    globeImageUrl={globeImageUrl}
    backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

    hexPolygonsData={countries.features}
      hexPolygonResolution={3}
      hexPolygonMargin={0.3}
      hexPolygonColor={() => `#${Math.round(Math.random() * Math.pow(2, 24)).toString(16).padStart(6, '0')}`}
      hexPolygonLabel={({ properties: d }) => `
        <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
        Population: <i>${d.POP_EST}</i>
      `}
  />;
};

function App() {
  return (
    <div className="App">
      <World />
    </div>
  );
}

export default App;
