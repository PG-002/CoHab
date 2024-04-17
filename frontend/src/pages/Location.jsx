import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../components/Map.css';

function Location({socket, userInfo}) {
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


  const createCustomIcon = (name) => {
    const iconUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=bbf7d0&color=052e16&bold=true`;
    return L.divIcon({
      html: `<div style="
                background-image: url('${iconUrl}');
                width: 35px;
                height: 35px;
                display: block;
                background-size: cover;
                border-radius: 5px;
                border: 2px solid white;
            "></div>`,
      className: '', // This is important to remove default Leaflet icon styles
      iconUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=bbf7d0&color=052e16&bold=true`,
      iconSize: [35, 35], // Size of the icon
      iconAnchor: [25, 50], // Point of the icon which will correspond to marker's location
      popupAnchor: [0, -50] // Point from which the popup should open relative to the iconAnchor
    });
  };


  const currentUserName = `${userInfo.firstName} ${userInfo.lastName}`;

  return (
    <MapContainer center={currentPosition || [28.6024, -81.2001]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {currentPosition && (
        <Marker position={currentPosition} icon={createCustomIcon(currentUserName)}>
          <Popup>
            <div>{`${userInfo.firstName} ${userInfo.lastName}`}</div>
          </Popup>
        </Marker>
      )}
      {otherUserLocations.map((userLocation, index) => (
        <Marker
          key={index}
          position={[userLocation.lat, userLocation.long]}
          icon={createCustomIcon(userLocation.name)}>
          <Popup>
            <div>{`${userLocation.firstName} ${userLocation.lastName}`}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Location;
