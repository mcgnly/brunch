import {
  GoogleMap,
  Marker,
  TransitLayer,
  useLoadScript,
  InfoWindow
} from "@react-google-maps/api";
import React from "react";
import "./App.css";
import stationList from "./stationList.json";
import { InfoBoxContents } from "./InfoBoxContents";
import calculateDistance from "./calculateDistance";
// set outside of component so as not to become a new array during every component refresh
const libraries = ["places"];

const mapStyle = {
  width: "100vw",
  height: "100vh"
};

const options = {
  disableDefaultUI: true,
  zoomControl: true
};
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function App() {
  //   start at center of Berlin
  const mapCenter = {
    lat: 52.52,
    lng: 13.405
  };
  const [station, setStation] = React.useState("");
  const [mapZoom, setMapZoom] = React.useState(11);
  const [searchType, setSearchType] = React.useState("breakfast");
  const [error, setError] = React.useState("");
  const [infoBoxOpen, setInfoBoxOpen] = React.useState(false);
  const [stationMarker, setStationMarker] = React.useState({});
  const [destinationMarker, setDestinationMarker] = React.useState(mapCenter);
  const [destination, setDestination] = React.useState({});

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    // helps not randomly reload and recenter map
    libraries
  });

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const randomlyPickStation = () => {
    const stations = Object.keys(stationList);
    const amountOfChoices = stations.length;
    const randomIndex = Math.floor(Math.random() * amountOfChoices);
    const selectedStation = stations[randomIndex];
    const stationLatLng = stationList[selectedStation].station;
    setStation(selectedStation);
    setStationMarker(stationLatLng);

    const destinationLatLng =
      stationList[selectedStation][searchType]?.geometry?.location;

    if (destinationLatLng === undefined) {
      setError("sorry, no good options near this station, try again");
    }
    setDestination(stationList[selectedStation][searchType]);
    setDestinationMarker(destinationLatLng);
    const distance = calculateDistance(stationLatLng, destinationLatLng) * 1000;
    if (distance > 500) {
      setMapZoom(15);
    } else if (300 < distance < 500) {
      setMapZoom(16.5);
    } else {
      setMapZoom(18);
    }
    setInfoBoxOpen(true);
  };

  function StationRandomizer() {
    return (
      <div>
        <button
          className="btn"
          onClick={() => {
            randomlyPickStation();
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
        center={destinationMarker}
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
                lng: destinationMarker.lng
              }}
              onClick={() => setInfoBoxOpen(true)}
            />
            {infoBoxOpen && (
              <InfoWindow
                onCloseClick={() => setInfoBoxOpen(false)}
                position={{
                  lat:
                    destinationMarker.lat +
                    (mapZoom === 15
                      ? 0.001
                      : mapZoom === 16.5
                      ? 0.0003
                      : 0.00001),
                  lng: destinationMarker.lng
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
          <StationRandomizer />
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
