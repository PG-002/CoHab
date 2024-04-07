import 'package:flutter/material.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            const Text(
              'Notification Settings',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SwitchListTile(
              title: const Text('Push Notifications'),
              value: true, // Set initial value or fetch from preferences
              onChanged: (bool value) {
                // Handle toggling of push notifications
              },
            ),
            SwitchListTile(
              title: const Text('Email Notifications'),
              value: true, // Set initial value or fetch from preferences
              onChanged: (bool value) {
                // Handle toggling of email notifications
              },
            ),
            const SizedBox(height: 20),
            const Text(
              'App Settings',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            ListTile(
              title: const Text('Dark Mode'),
              trailing: Switch(
                value: false, // Set initial value or fetch from preferences
                onChanged: (bool value) {
                  // Handle toggling of dark mode
                },
              ),
            ),
            ListTile(
              title: const Text('Language'),
              trailing: const Icon(Icons.arrow_forward_ios),
              onTap: () {
                // Navigate to language settings page
              },
            ),
          ],
        ),
      ),
    );
  }
}