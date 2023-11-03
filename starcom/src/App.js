// CSS
import './App.css';
import './ImageOverlay.css'; // Create this CSS file for styling

// Libraries
import Globe from 'react-globe.gl';
import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3'; // Import d3 library

// Components
import AboutPopup from './components/AboutPopup'; // Updated import path

// Images
//import globeImageUrl from './assets/earthmap1k.jpeg';
import uiFacadeBottomLeft from './images/Starcom-UI_ConceptArt-bottomLeft.png';
import uiFacadeBottomMiddle from './images/Starcom-UI_ConceptArt-bottomMiddle.png';
import uiFacadeBottomRight from './images/Starcom-UI_ConceptArt-bottomRight.png';
import uiFacadeSideLeft from './images/Starcom-UI_ConceptArt-sideLeft.png';

// Data
import datasetWorldPopulation from './data/world_population.csv';
import datasetCountries from './data/ne_110m_admin_0_countries.geojson';

function generateRandomColor() {
  const r = Math.floor(0); // Limited to reduce intensity of red
  const g = Math.floor(Math.random() * 255); // Slightly more green
  const b = Math.floor(128 + (Math.random() * 127)); // More blue

  return `rgb(${r}, ${g}, ${b})`;
}

function UIFacadeBottomLeft() {
  return (
    <div className="image-uifacade-bottomleft"> {/* Apply the image-overlay class here */}
      <img
        src={uiFacadeBottomLeft}
        alt="Overlay"
      />
    </div>
  );
}

function UIFacadeBottomMiddle() {
  return (
    <div className="image-uifacade-bottommiddle"> {/* Apply the image-overlay class here */}
      <img
        src={uiFacadeBottomMiddle}
        alt="Overlay"
      />
    </div>
  );
}

function UIFacadeBottomRight() {
  return (
    <div className="image-uifacade-bottomright"> {/* Apply the image-overlay class here */}
      <img
        src={uiFacadeBottomRight}
        alt="Overlay"
      />
    </div>
  );
}

function UIFacadeSideLeft() {
  return (
    <div className="image-uifacade-sideleft"> {/* Apply the image-overlay class here */}
      <img
        src={uiFacadeSideLeft}
        alt="Overlay"
      />
    </div>
  );
}


function World() {
  const [countries, setCountries] = useState({ features: [] });
  const [popData, setPopData] = useState([]);

  const globeRef = useRef(null);
  const weightColor = d3.scaleSequentialSqrt(d3.interpolateRdYlBu)
  .domain([0, 1e7]);

  useEffect(() => {
    // Auto-rotate
    globeRef.current.controls().autoRotate = true;
    globeRef.current.controls().autoRotateSpeed = 0.1;

    // Countries
    fetch(datasetCountries)
      .then(res => res.json())
      .then(setCountries);

    // Population
    fetch(datasetWorldPopulation)
      .then(res => res.text())
      .then(csv => d3.csvParse(csv, ({ lat, lng, pop }) => ({ lat: +lat, lng: +lng, pop: +pop })))
      .then(setPopData);
  }, []);

  return (
    <Globe
      ref={globeRef}
      // globeImageUrl={globeImageUrl}
      // backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

      hexBinPointsData={popData}
      hexBinPointWeight="pop"
      hexAltitude={d => d.sumWeight * 6e-8}
      hexBinResolution={4}
      hexTopColor={d => weightColor(d.sumWeight)}
      hexSideColor={d => weightColor(d.sumWeight)}
      hexBinMerge={true}
      //enablePointerInteraction={false}

      hexPolygonsData={countries.features}
      hexPolygonResolution={3}
      hexPolygonMargin={0.3}
      hexPolygonColor={() => generateRandomColor()}
      hexPolygonLabel={({ properties: d, bbox: b }) => `
        <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
        Population: <i>${d.POP_EST}</i> <br />
        Latitude: <i>${((b[1] + b[3])/2.0).toFixed(2)}</i> <br />
        Longitude: <i>${((b[0] + b[2])/2.0).toFixed(2)}}}</i> <br />
      `}
    />
  );
}

function App() {
  const [showAbout, setShowAbout] = useState(false);

  const handleShowAbout = () => {
    setShowAbout(true);
  }

  const handleCloseAbout = () => {
    setShowAbout(false);
  }

  return (
    <div className="App">
      <div className="top-middle-text">
        Starcom App: Global OSINT Operations Command Control Interface
      </div>
      <div className="button-container">
        <div className="login-container">
          <button className="login-button">Login</button>
        </div>
        <div className="button-stack">
          <button onClick={handleShowAbout}>About</button>
          <a href="https://discord.gg/FB2yDA5Mzs"><button>Discord</button></a>
          <a href="https://github.com/Jthora/starcom-react-web"><button>Github</button></a>
        </div>
      </div>
      <UIFacadeBottomLeft />
      <UIFacadeBottomMiddle />
      <UIFacadeBottomRight />
      <UIFacadeSideLeft />
      <World />

      {showAbout && <AboutPopup />}
    </div>
  );
}

export default App;
