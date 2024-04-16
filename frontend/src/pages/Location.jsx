import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { jwtDecode } from "jwt-decode";
import 'leaflet/dist/leaflet.css';
import '../components/Map.css';

function Location({socket}) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [otherUserLocations, setOtherUserLocations] = useState([]);
  const locationUpdateInterval = 60000; // Update every 60 seconds

  useEffect(() => {
    // Emit the location update to the server via socket
    const emitLocation = (position) => {
      socket.emit('updateLocation', position.coords.latitude, position.coords.longitude);
    };

    // Fetch and watch the user's current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        emitLocation(position);
      }, 
      (error) => {
        console.error('Error getting current position:', error);
      }
    );

    // Set up the interval to update location
    const intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(emitLocation);
    }, locationUpdateInterval);

    // Handle 'locationChange' event from the server
    const handleLocationChange = (locationData) => {
      setOtherUserLocations(prevLocations => {
        const updatedLocations = prevLocations.filter(loc => loc.userId !== locationData.userId);
        if (locationData.location.isTracking) {
          updatedLocations.push(locationData);
        }
        return updatedLocations;
      });
    };

    socket.on('locationChange', handleLocationChange);

    // Clear the interval and the listener when the component unmounts
    return () => {
      clearInterval(intervalId);
      socket.off('locationChange', handleLocationChange);
    };
  }, [socket]);

  return (
    <MapContainer center={currentPosition || [28.6024, -81.2001]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {currentPosition && (
        <Marker position={currentPosition}>
          <Popup>Me</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default Location;