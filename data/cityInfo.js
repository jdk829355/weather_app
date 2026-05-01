
const cityToCoordinates = {
  "Seoul": {
    "lat": 37.5666791,
    "lon": 126.9782914
  },
  "Tokyo": {
    "lat": 35.6895056,
    "lon": 139.6917000
  },
  "Paris": {
    "lat": 48.8588897,
    "lon": 2.3200410217200766
  },
  "London": {
    "lat": 51.5074456,
    "lon": -0.1277653
  }
};

const cities = Object.keys(cityToCoordinates);

export { cityToCoordinates, cities };