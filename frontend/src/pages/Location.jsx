import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { HashLoader } from "react-spinners";
import 'leaflet/dist/leaflet.css';
import '../components/Map.css';

function Location({socket, userInfo}) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [otherUserLocations, setOtherUserLocations] = useState([]);
  const [mapReady, setMapReady] = useState(false);
  const locationUpdateInterval = 60000;

  useEffect(() => {
    if (userInfo.location.isTracking) {
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
            setMapReady(true);
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
          setOtherUserLocations(locationData);
        };
      
        socket.on('locationChange', handleLocationChange);
      
        // Clear the interval and the listener when the component unmounts
        return () => {
          clearInterval(intervalId);
          socket.off('locationChange', handleLocationChange);
        };
    }
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
      iconSize: [35, 35],
      iconAnchor: [25, 50], // Point of the icon which will correspond to marker's location
      popupAnchor: [0, -50] // Point from which the popup should open relative to the iconAnchor
    });
  };


  const currentUserName = `${userInfo.firstName} ${userInfo.lastName}`;

  if (userInfo.location.isTracking) {
    return mapReady ? (
      <MapContainer center={currentPosition} zoom={13} style={{ height: '100vh', width: '100%' }}>
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
              <div>{userLocation.name}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    ) : (<div className="flex flex-col items-center justify-center w-full h-screen"><HashLoader color="#36d7b7" /></div>);
  } else {
    return (
      <div className="map_modal_container">
    <div className="map_modal">
      Map is not available. Make sure tracking is enabled in settings.
    </div>
  </div>
    );
  }
}


export default Location;
