import 'package:flutter/material.dart';
import 'token.dart';
import 'task_list.dart';
import 'calendar.dart';
import 'groupchat.dart';
import 'noise_level.dart';
import 'settings.dart';


class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
 createState() => _Dashboard();
}

class _Dashboard extends State<DashboardPage> {


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('         Dashboard'),
      ),
      //body: GoogleMap(
      //onMapCreated: (controller) {
      // _mapController = controller;
      // },
      // initialCameraPosition: const CameraPosition(
      //  target: LatLng(0, 0), // Initial center of the map
      // zoom: 12, // Initial zoom level
      //),
      // myLocationEnabled: true, // Show the user's location
      // myLocationButtonEnabled: true, // Enable the my location button
      //),
    );
  }

}
