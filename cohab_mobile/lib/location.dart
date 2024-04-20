
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:http/http.dart'
    as http; // Import the http package for making network requests
import 'token.dart';
import 'web_socket.dart';

class LocationTrackerPage extends StatefulWidget {
  const LocationTrackerPage({super.key});

  @override
  createState() => _LocationTrackerPageState();
}

class _LocationTrackerPageState extends State<LocationTrackerPage> {
  late Position _currentPosition;
  GoogleMapController? _mapController;

  List<Map<String, dynamic>> _userLocations = [];
  Set<Marker> _markers = {};

  @override
  void initState() {
    super.initState();
    _requestLocationPermission();
    //socket.on('locationChange', _onLocationChange);
    socket.on('locationChange', (data) {
      print('Location update: $data');
      _onLocationChange(data);
    });
  }

  void _onMapCreated(GoogleMapController controller) {
    _mapController = controller;

    _setMarkers();
  }

  // Request location permission
  void _requestLocationPermission() async {
    LocationPermission permission = await Geolocator.requestPermission();
    if (permission == LocationPermission.denied) {
      print('Location permission denied');
    } else {
      getCurrentLocation();
    }
  }

  void getCurrentLocation() async {
    try {
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      if (mounted) {
        setState(() {
          _currentPosition = position;
        });
      }

      if (_mapController == null) {
        print('Map controller is not initialized yet.');
        return;
      }
      print('_mapController initialized? ${_mapController != null}');

      if (_mapController != null) {
        _mapController!.animateCamera(
          CameraUpdate.newLatLng(
            LatLng(_currentPosition.latitude, _currentPosition.longitude),
          ),
        );
      }

      if (socket.connected) {
        try {
          print([_currentPosition.latitude, _currentPosition.longitude]);
          socket.emit('updateLocation',
              [_currentPosition.latitude, _currentPosition.longitude]);
        } catch (e) {
          print('Error emitting updateLocation event: $e');
        }
        socket.on('locationChange', (data) {
          print('Location update: $data');
          _onLocationChange(data);
        });

        /*socket.on('locationChange', (data) {
          //print("Hey");
          print('Location update: $data');
        });*/
      } else {
        print('Socket is not connected');
      }
    } catch (e) {
      print('Error getting location: $e');
    }
  }

  void _onLocationChange(dynamic data) {
    if (mounted) {
      setState(() {
        _userLocations = List<Map<String, dynamic>>.from(data);
      });
    }
    print("Printing user locations: ");
    print(_userLocations);
    _setMarkers();
  }

  void _setMarkers() async {
    Set<Marker> markers = {};
    for (var userLocation in _userLocations) {
      String name = userLocation['name'] ?? 'Unknown User';
      double latitude = userLocation['lat'] ?? 0.0;
      double longitude = userLocation['long'] ?? 0.0;

      LatLng position = LatLng(latitude, longitude);
      String markerId = '${name}_$latitude$longitude';

      String iconUrl =
          'https://ui-avatars.com/api/?name=${Uri.encodeComponent(name)}&background=bbf7d0&color=052e16&bold=true&size=128';

      BitmapDescriptor icon = await _loadCustomIcon(iconUrl);

      Marker marker = Marker(
        markerId: MarkerId(markerId),
        position: position,
        icon: icon,
        infoWindow: InfoWindow(
          title: name,
          snippet: 'Location of $name',
        ),
      );

      markers.add(marker);
    }

    if (mounted) {
      setState(() {
        _markers = markers;
      });
    }
  }

  Future<BitmapDescriptor> _loadCustomIcon(String url) async {
    try {
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        Uint8List imageData = response.bodyBytes;
        return BitmapDescriptor.fromBytes(imageData);
      } else {
        print('Failed to load icon from URL: $url');
        return BitmapDescriptor.defaultMarker;
      }
    } catch (e) {
      print('Error loading icon: $e');
      return BitmapDescriptor.defaultMarker;
    }
  }

  void zoomIn() {
    if (_mapController != null) {
      _mapController!.animateCamera(CameraUpdate.zoomIn());
    }
  }

  void zoomOut() {
    if (_mapController != null) {
      _mapController!.animateCamera(CameraUpdate.zoomOut());
    }
  }

  /*@override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Location Tracker'),
      ),
      body: GoogleMap(
        onMapCreated: _onMapCreated,
        initialCameraPosition: const CameraPosition(
          target: LatLng(0, 0),
          zoom: 12,
        ),
        myLocationEnabled: true,
        myLocationButtonEnabled: true,
        markers: _markers, 
      ),
      
      
    );
  }*/
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Location Tracker'),
      ),
      body: Stack(
        children: [
          GoogleMap(
            onMapCreated: _onMapCreated,
            initialCameraPosition: const CameraPosition(
              target: LatLng(0, 0),
              zoom: 12,
            ),
            myLocationEnabled: true,
            myLocationButtonEnabled: true,
            markers: _markers,
          ),
          // Positioning the zoom buttons
          Positioned(
            bottom: 20,
            right: 20,
            child: Column(
              // children: [
              //   // Zoom In button
              //   FloatingActionButton(
              //     heroTag: 'zoom_in_fab',
              //     onPressed: zoomIn,
              //     tooltip: 'Zoom In',
              //     child: const Icon(Icons.add),
              //   ),
              //   const SizedBox(height: 10),
              //   // Zoom Out button
              //   FloatingActionButton(
              //     heroTag: 'zoom_out_fab',
              //     onPressed: zoomOut,
              //     tooltip: 'Zoom Out',
              //     child: const Icon(Icons.remove),
              //   ),
              // ],
            ),
          ),
        ],
      ),
    );
  }
}
