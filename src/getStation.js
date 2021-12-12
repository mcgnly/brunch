import { getGeocode, getLatLng } from "use-places-autocomplete";

export const getStation=(selectedStation, setStationMarker)=> {
    const stationLatLng = getGeocode({ address: selectedStation })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        console.log("📍 Coordinates: ", { lat, lng });
        setStationMarker({ lat, lng });
        return { lat, lng };
      })
      .catch((error) => {
        console.log("😱 Error: ", error);
      });
    return stationLatLng;
  }