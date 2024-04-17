import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../components/Map.css';

function Location({socket}) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [otherUserLocations, setOtherUserLocations] = useState([]);
  const locationUpdateInterval = 60000;

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
        },
        { enableHighAccuracy: true } // Optional: enable this for more accuracy
      );
    }, locationUpdateInterval);
  
    // Handle 'locationChange' event from the server
    const handleLocationChange = (locationData) => {
      console.log(locationData);
      console.log("Hello I sent the locationData");
      setOtherUserLocations(locationData);
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
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {currentPosition && (
        <Marker position={currentPosition}>
          <Popup>Me</Popup>
        </Marker>
      )}
      {otherUserLocations.map((userLocation, index) => (
        <Marker key={index} position={[userLocation.lat, userLocation.long]}>
          <Popup>{userLocation.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Location;
