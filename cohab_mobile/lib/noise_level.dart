import 'package:flutter/material.dart';
import 'token.dart';
import 'web_socket.dart';


class NoiseLevelPage extends StatefulWidget {
  const NoiseLevelPage({super.key});

  @override
  createState() => _NoiseLevelPageState();
}

class _NoiseLevelPageState extends State<NoiseLevelPage> {
  late int _currentNoiseLevel; // Initial value for noise level

  @override
  void initState() {
     _currentNoiseLevel = noise_level;
    super.initState();

  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Noise Level',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: const Color(0xFF14532d),
        iconTheme: const IconThemeData(color: Colors.white),
        titleSpacing: 0,
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            const SizedBox(height: 200),
            const Center(
              child: Text(
                'Select your preferred noise level:',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 30),
            Slider(
              value: _currentNoiseLevel.toDouble(),
              min: 0,
              max: 10,
              divisions: 10,
              onChanged: (double value) {
                setState(() {
                  _currentNoiseLevel = value.toInt();
                });
              },
              label: _currentNoiseLevel.toString(),
            ),
            const SizedBox(height: 20),
            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Text(
                  'Quiet',
                  style: TextStyle(fontSize: 16),
                ),
                Text(
                  'Normal',
                  style: TextStyle(fontSize: 16),
                ),
                Text(
                  'Loud',
                  style: TextStyle(fontSize: 16),
                ),
              ],
            ),
            const SizedBox(height: 40),
            Center(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text(
                    'Current Noise Level Preference: $_currentNoiseLevel',
                    style: const TextStyle(
                      fontSize: 18,
                    ),
                  ),
                  const SizedBox(height: 30),
                  ElevatedButton(
                    onPressed: () {
                      // Save the noise level preference
                      // For example, you can use SharedPreferences or any other storage mechanism
                      print('Preferred noise level: $_currentNoiseLevel');

                      socket.emit('setNoiseLevel', _currentNoiseLevel.toInt());
                      noise_level = _currentNoiseLevel;
                    },
                    child: const Text('Save Preference'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}