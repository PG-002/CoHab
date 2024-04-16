import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { jwtDecode } from "jwt-decode";
import 'leaflet/dist/leaflet.css';
import '../components/Map.css';

function Location({socket}) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [otherUserLocations, setOtherUserLocations] = useState([]);

  useEffect(() => {
    // Trigger 'updateLocation' event with the user's current position
    const updateMyLocation = (position) => {
      setCurrentPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });

      // Emit the location update to the server via socket
      socket.emit('updateLocation', position.coords.latitude, position.coords.longitude);
      console.log("It was indeed emitted");
    };

    // Fetch and watch the user's current position
    navigator.geolocation.getCurrentPosition(updateMyLocation, (error) => {
      console.error('Error getting current position:', error);
    });

    // Handle 'locationChange' event from the server
    const handleLocationChange = (locationData) => {
      console.log("Being called");
      setOtherUserLocations((prevLocations) => {
        // This assumes locationData has a unique identifier, such as userId
        return prevLocations.filter(loc => loc.userId !== locationData.userId)
          .concat(locationData);
      });
      console.log("It was indeed received");
    };

    socket.on('locationChange', handleLocationChange);

    // Clean up on unmount
    return () => {
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