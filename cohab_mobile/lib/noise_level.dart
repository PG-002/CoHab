import 'package:flutter/material.dart';

class NoiseLevelPage extends StatefulWidget {
  const NoiseLevelPage({super.key});

  @override
   createState() => _NoiseLevelPageState();
}

class _NoiseLevelPageState extends State<NoiseLevelPage> {
  double _currentNoiseLevel = 5; // Initial value for noise level

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Noise Level Preference'),
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
              value: _currentNoiseLevel,
              min: 0,
              max: 10,
              divisions: 10,
              onChanged: (double value) {
                setState(() {
                  _currentNoiseLevel = value;
                });
              },
              label: _currentNoiseLevel.round().toString(),
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
                    'Current Noise Level Preference: ${_currentNoiseLevel.round()}',
                    style: const TextStyle(
                      fontSize: 18,
                    ),
                  ),
                  const SizedBox(height: 30),
                  ElevatedButton(
                    onPressed: () {
                      // Save the noise level preference
                      // For example, you can use SharedPreferences or any other storage mechanism
                      print('Preferred noise level: ${_currentNoiseLevel.round()}');
                    },
                    child: const Text('Save Preference'),
                  ),
                ],
              ),
            ),
    ]
    ,
        ),
      ),
    );
  }
}