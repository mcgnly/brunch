export default function calculateDistance(coord1, coord2) {
  if (coord1.lat === coord2.lat && coord1.lng === coord2.lng) {
    return 0;
  } else {
    var radlat1 = (Math.PI * coord1.lat) / 180;
    var radlat2 = (Math.PI * coord2.lat) / 180;
    var theta = coord1.lng - coord2.lng;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    // convert to km
    dist = dist * 60 * 1.1515 * 1.609344;
    return dist;
  }
}
