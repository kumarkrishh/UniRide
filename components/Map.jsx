// pages/findRide.js or a component in components/Map.js

"use client"

const MapComponent = () => {
  return (
    <iframe
      src="https://storage.googleapis.com/maps-solutions-0w5qygddkl/address-selection/ta9u/address-selection.html"
      width="120%"
      height="120%"
      style={{ border: 0 }}
      loading="lazy"
    ></iframe>
  );
};

export default MapComponent;

