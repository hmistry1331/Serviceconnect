export const GUJARAT_CITIES = [
  { value: "Ahmedabad", label: "Ahmedabad", latitude: 23.0225, longitude: 72.5714 },
  { value: "Gandhinagar", label: "Gandhinagar", latitude: 23.2156, longitude: 72.6369 },
  { value: "Surat", label: "Surat", latitude: 21.1702, longitude: 72.8311 },
  { value: "Baroda", label: "Baroda (Vadodara)", latitude: 22.3072, longitude: 73.1812 },
  { value: "Bharuch", label: "Bharuch", latitude: 21.7051, longitude: 72.9959 },
  { value: "Valsad", label: "Valsad", latitude: 20.5992, longitude: 72.9342 },
];

export function getCityByValue(cityValue) {
  if (!cityValue) return null;
  return GUJARAT_CITIES.find((city) => city.value === cityValue) || null;
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

export function getDistanceKm(lat1, lng1, lat2, lng2) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export function getNearestSupportedCity(latitude, longitude) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  let nearest = null;
  for (const city of GUJARAT_CITIES) {
    const distanceKm = getDistanceKm(latitude, longitude, city.latitude, city.longitude);
    if (!nearest || distanceKm < nearest.distanceKm) {
      nearest = { city, distanceKm };
    }
  }

  return nearest;
}
