import React, { useState, useEffect } from 'react';
import { useLocationSocket } from '../components/LocationSocketContext'; 
import Map from '../components/Map'
function Location() {
  const socket = useLocationSocket();
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // This effect handles the geolocation and emits the location to the server
  useEffect(() => {
    let watcher = null;

    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      setPosition({ latitude, longitude });
      socket.emit('updateLocation', { longitude, latitude });
    };

    const handleError = (error) => {
      console.error('Geolocation error:', error);
    };

    if (socket && userInfo?.location?.isTracking) { // Ensure optional chaining is used for isTracking
      if ("geolocation" in navigator) {
        watcher = navigator.geolocation.watchPosition(handleSuccess, handleError, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      } else {
        console.error("Geolocation is not available in your browser.");
      }
    }

    // Clear the watcher when the component unmounts
    return () => {
      if (watcher) {
        navigator.geolocation.clearWatch(watcher);
      }
    };
  }, [socket, userInfo]); // Add userInfo to the dependency array

  // This effect handles listening for location changes from the server
  useEffect(() => {
    if (socket) {
      const handleLocationChange = (locationData) => {
        console.log("Location change event received:", locationData);
        setPosition({
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        });
      };

      socket.on('locationChange', handleLocationChange);

      // Return a cleanup function to remove the event listener
      return () => {
        socket.off('locationChange', handleLocationChange);
      };
    }
  }, [socket]);

  // JSX for rendering the location
  return (
    <div>
      <h2>My Current Location</h2>
      {position.latitude !== null && position.longitude !== null ? (
        <p>
          Latitude: {position.latitude}, Longitude: {position.longitude}
        </p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Location;
