/*import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'web_socket.dart';

class LocationTrackerPage extends StatefulWidget {
  const LocationTrackerPage({super.key});

  @override
  createState() => _LocationTrackerPageState();
}

class _LocationTrackerPageState extends State<LocationTrackerPage> {
  late Position _currentPosition;
  late GoogleMapController _mapController;

  @override
  void initState() {
    super.initState();
    init();
    _requestLocationPermission();
  }


  void _onMapCreated(GoogleMapController controller) {
    _mapController = controller;
  }

  void _requestLocationPermission() async {
    LocationPermission permission = await Geolocator.requestPermission();
    if (permission == LocationPermission.denied) {
      // Handle denied permission
      print('Location permission denied');
    } else if (permission == LocationPermission.deniedForever) {
      // Handle denied permission forever
      print('Location permission denied forever');
    } else {
      // Permission granted, get the current location
      getCurrentLocation();
    }
  }

  void getCurrentLocation() async {
    try {
      Position position = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high);
      setState(() {
        _currentPosition = position;
      });

      // Move camera to current location
      _mapController.animateCamera(
        CameraUpdate.newLatLng(
          LatLng(_currentPosition.latitude, _currentPosition.longitude),
        ),
      );

      //print(_currentPosition.latitude);
      //print(_currentPosition.longitude);

      if (socket.connected) {
        print('Socket is connected');
        // Emit location data to server
        try {
          socket.emit('updateLocation', {
            'lat': _currentPosition.latitude,
            'long': _currentPosition.longitude,
          });

          socket.on('locationChange', (data) {
            print("Location update failed: $data");
          });
          print("Yay!");
        } catch (e) {
          print('Error emitting location data: $e');
        }
      } else {
        print('Socket is not connected');
      }

      /*if (socket.connected) {
        print('Socket is connected');
      } else {
        print('Socket is not connected');
      }
      // Emit location data to server
      socket.emit('updateLocation', {
        'lat': _currentPosition.latitude,
        'long': _currentPosition.longitude,
       
      });

      // Listen for location updates from server
      socket.on('locationChange', (data) {
        // Print received data
        print("Received location change data from server: $data");
      });
      socket.onConnectError((error) {
        print("Connection error occurred: $error");
      });*/
    } catch (e) {
      print('Error getting location: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Location Tracker'),
      ),
      body: GoogleMap(
        onMapCreated: (controller) {
          _mapController = controller;
        },
        initialCameraPosition: const CameraPosition(
          target: LatLng(0, 0), // Initial center of the map
          zoom: 12, // Initial zoom level
        ),
        myLocationEnabled: true, // Show the user's location
        myLocationButtonEnabled: true, // Enable the my location button
      ),
    );
  }
}*/

import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'web_socket.dart';

class LocationTrackerPage extends StatefulWidget {
  const LocationTrackerPage({super.key});

  @override
  createState() => _LocationTrackerPageState();
}

class _LocationTrackerPageState extends State<LocationTrackerPage> {
  late Position _currentPosition;
  late GoogleMapController _mapController;

  @override
  void initState() {
    super.initState();
    init();
    _requestLocationPermission();
  }

  // Initialize the GoogleMapController in the onMapCreated callback
  void _onMapCreated(GoogleMapController controller) {
    _mapController = controller;
  }

  // Request location permission
  void _requestLocationPermission() async {
    LocationPermission permission = await Geolocator.requestPermission();
    if (permission == LocationPermission.denied) {
      
      print('Location permission denied');
    } else if (permission == LocationPermission.deniedForever) {
      
      print('Location permission denied forever');
    } else {
      
      getCurrentLocation();
    }
  }

  
  void getCurrentLocation() async {
    try {
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      setState(() {
        _currentPosition = position;
      });

      print('_mapController initialized? ${_mapController != null}');
      // Now that the controller is initialized, move the camera to current location
      _mapController.animateCamera(
        CameraUpdate.newLatLng(
          LatLng(_currentPosition.latitude, _currentPosition.longitude),
        ),
      );
     

      if (socket.connected) {
        try {
          socket.emit('updateLocation', [_currentPosition.latitude, _currentPosition.longitude]);
        
        } catch (e) {
          print('Error emitting updateLocation event: $e');
        }

        socket.on('locationChange', (data) {
          print('Location update: $data');
        });
       
      } else {
        print('Socket is not connected');
      }
    } catch (e) {
      print('Error getting location: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Location Tracker'),
      ),
      body: GoogleMap(
        onMapCreated: _onMapCreated, // Initialize controller in onMapCreated
        initialCameraPosition: const CameraPosition(
          target: LatLng(0, 0), 
          zoom: 12, 
        ),
        myLocationEnabled: true, 
        myLocationButtonEnabled: true, 
      ),
    );
  }
}
