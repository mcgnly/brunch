import {
  GoogleMap,
  Marker,
  TransitLayer,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import React, { useState } from "react";

import "./App.css";
import stations from "./stations.json";
import { getDestination } from "./getDestination";
import { InfoBoxContents } from "./InfoBoxContents";
import { getStation } from "./getStation";
// import mapStyles from "./mapStyles";

// set outside of component so as not to become a new array during every component refresh
const libraries = ["places"];

const mapStyle = {
  width: "100vw",
  height: "100vh",
};

const options = {
  disableDefaultUI: true,
//   styles: mapStyles,
  zoomControl: true,
};
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function App() {
  const [station, setStation] = useState("");
  const [searchType, setSearchType] = useState("breakfast");
  const [error, setError] = useState("");
  const [infoBoxOpen, setInfoBoxOpen] = useState(false);
  const [stationMarker, setStationMarker] = useState({});
  const [destinationMarker, setDestinationMarker] = useState({});
  const [destination, setDestination] = useState({});

  const mapZoom = 11;
  //   start at center of Berlin
  const mapCenter = {
    lat: 52.52,
    lng: 13.405,
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    // helps not randomly reload and recenter map
    libraries,
  });

  const mapRef = React.useRef();
  const throttling = React.useRef(false);
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback((destinationCoords) => {
    const lat = destinationCoords.lat;
    const lng = destinationCoords.lng;
    mapRef.current.setZoom(15);
    mapRef.current.panTo({ lat, lng });
  }, []);

  const randomlyPickStation = (panTo) => {
    if (throttling.current) {
      return;
    }
    throttling.current = true;
    const amountOfChoices = stations.length;
    const randomIndex = Math.floor(Math.random() * amountOfChoices);
    const selectedStation = stations[randomIndex];
    setStation(selectedStation);

    getStation(selectedStation, setStationMarker)
      .then((stationLatLng) => {
        return getDestination(
          stationLatLng,
          apiKey,
          searchType,
          setDestination,
          setDestinationMarker,
          setError
        );
      })
      .then((coordinates) => {
        panTo(coordinates);
        setInfoBoxOpen(true);
      })
      .catch((err) => console.log("😱 main thread Error: ", err));
    setTimeout(() => {
      throttling.current = false;
    }, 5000);
  };

  function StationRandomizer({ panTo, station, randomlyPickStation }) {
    return (
      <div>
        <button
          className="btn"
          onClick={() => {
            randomlyPickStation(panTo);
          }}
        >
          roll the dice
        </button>
      </div>
    );
  }

  if (loadError) {
    return "load error....";
  }
  if (!isLoaded) {
    return "loading....";
  }
  return (
    <div className="App">
      <GoogleMap
        center={mapCenter}
        mapContainerStyle={mapStyle}
        zoom={mapZoom}
        onLoad={onMapLoad}
        options={options}
      >
        <h1 className="title">
          <span role="img" aria-label="eggs">
            🍳
          </span>
          Take Me to Brunch
        </h1>
        <TransitLayer />
        {stationMarker.lat && (
          <div>
            <Marker
              key={`${stationMarker.lat}-${stationMarker.lng}`}
              position={{ lat: stationMarker.lat, lng: stationMarker.lng }}
            />
          </div>
        )}

        {destinationMarker.lat && (
          <div>
            <Marker
              key={`${destinationMarker.lat}-${destinationMarker.lng}`}
              position={{
                lat: destinationMarker.lat,
                lng: destinationMarker.lng,
              }}
            />
            {infoBoxOpen && (
              <InfoWindow
                onCloseClick={() => setInfoBoxOpen(false)}
                position={{
                  lat: destinationMarker.lat,
                  lng: destinationMarker.lng,
                }}
              >
                <InfoBoxContents
                  station={station}
                  destination={destination}
                  error={error}
                  searchType={searchType}
                />
              </InfoWindow>
            )}
          </div>
        )}
        <div>
          <StationRandomizer
            panTo={panTo}
            station={station}
            randomlyPickStation={randomlyPickStation}
          />
        </div>
        <div className={"searchingFor"}>
          <h4>What are you looking for today?</h4>
          <div>
            <input
              type="radio"
              id="breakfast"
              value="breakfast"
              checked={searchType === "breakfast"}
              onClick={() => setSearchType("breakfast")}
            />
            <label for="breakfast">breakfast</label>
          </div>
          <div>
            <input
              type="radio"
              id="coffee"
              value="coffee"
              checked={searchType === "coffee"}
              onClick={() => setSearchType("coffee")}
            />
            <label for="coffee">coffee</label>
          </div>
        </div>
      </GoogleMap>
    </div>
  );
}

export default App;
