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
          socket.emit('updateLocation',
              [_currentPosition.latitude, _currentPosition.longitude]);
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
