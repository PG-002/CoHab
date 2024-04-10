import 'package:cohab_mobile/send_join_code.dart';
import 'package:cohab_mobile/token.dart';
import 'package:flutter/material.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('             Settings'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Center(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              const Text(
                '                       User Profile',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              ListTile(
                title: Text('                     Name: ${decodedToken['firstName']} ${decodedToken['lastName']}'),
              ),
              ListTile(
                title: Text('                   House: ${house['house']['houseName']}'),
              ),
              ListTile(
                title: Text('               Email: ${decodedToken['email']}'),
              ),
              const SizedBox(height: 25),
              Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Send House Invite Code',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 20), // Adjust the spacing between the text and the FloatingActionButton
                    FloatingActionButton(
                      onPressed: () {
                        // Add your functionality here
                        // You can call functions, navigate to other screens, update state, etc.
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const EmailInputPage()),
                        );
                      },
                      child: const Icon(Icons.people_alt),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}