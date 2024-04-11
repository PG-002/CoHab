import 'package:flutter/material.dart';
//import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'web_socket.dart'; 

class LocationTrackerPage extends StatefulWidget {
  const LocationTrackerPage({super.key});

  @override
  createState() => _LocationTrackerPageState();
}

class _LocationTrackerPageState extends State<LocationTrackerPage> {
  //late Position _currentPosition;
  late GoogleMapController _mapController;

  @override
  void initState() {
    super.initState();
   // _requestLocationPermission();
  }

  // void _requestLocationPermission() async {
  //   LocationPermission permission = await Geolocator.requestPermission();
  //   if (permission == LocationPermission.denied) {
  //     // Handle denied permission
  //     print('Location permission denied');
  //   } else if (permission == LocationPermission.deniedForever) {
  //     // Handle denied permission forever
  //     print('Location permission denied forever');
  //   } else {
  //     // Permission granted, get the current location
  //     getCurrentLocation();
  //   }
  // }

  // void getCurrentLocation() async {
  //   try {
  //     Position position = await Geolocator.getCurrentPosition(
  //         desiredAccuracy: LocationAccuracy.high);
  //     setState(() {
  //       _currentPosition = position;
  //     });
  //
  //     // Move camera to current location
  //     _mapController.animateCamera(
  //       CameraUpdate.newLatLng(
  //         LatLng(_currentPosition.latitude, _currentPosition.longitude),
  //       ),
  //     );
  //
  //     // Emit location data to server
  //     socket.emit('updateLocation', {
  //       'latitude': _currentPosition.latitude,
  //       'longitude': _currentPosition.longitude,
  //     });
  //
  //     // Listen for location updates from server
  //     socket.on('locationUpdate', (data) {
  //       print('Received location update: $data');
  //       // Handle location update received from server
  //       // Update UI, etc.
  //     });
  //   } catch (e) {
  //     print('Error getting location: $e');
  //     // Handle error here, e.g., show an error message to the user
  //   }
  // }

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
}
