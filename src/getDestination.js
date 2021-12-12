export const getDestination = async (
  { lat, lng },
  apiKey,
  searchType,
  setDestination,
  setDestinationMarker,
  setError
) => {
  const radiusInMeters = 800;
  const placesUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&input=${searchType}&inputtype=textquery&locationbias=circle%3A${radiusInMeters}%40${lat}%2C${lng}&key=${apiKey}`;

  return fetch(placesUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log("data from places", data.candidates.length?data.candidates[0].name:data);

      let destinationCoords;

      if (data.candidates.length > 0) {
        const sortedCandidates =
          data.candidates.length > 1
            ? data.candidates.sort(
                (firstItem, secondItem) => secondItem.rating - firstItem.rating
              )
            : data.candidates;
        setDestination(sortedCandidates[0]);
        destinationCoords = {
          lat: sortedCandidates[0].geometry.location.lat,
          lng: sortedCandidates[0].geometry.location.lng,
        };
      } else {
        setError("sorry, no good options near this station, try again");
        destinationCoords = { lat, lng };
      }

      console.log(
        "{ lat:sortedCandidates[0].geometry.location.lat, lng:sortedCandidates[0].geometry.location.lng } :>> ",
        destinationCoords
      );
      setDestinationMarker(destinationCoords);
      return destinationCoords;
    })
    .catch((err) => console.log("😱 Places Error: ", err));
};
