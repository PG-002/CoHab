import 'package:cohab_mobile/send_join_code.dart';
import 'package:cohab_mobile/token.dart';
import 'package:flutter/material.dart';
import 'web_socket.dart';
import 'main.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  void logout(BuildContext context) {
    socket.disconnect();

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const LoginPage()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Settings',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: const Color(0xFF14532d),
        iconTheme: const IconThemeData(color: Colors.white),
        titleSpacing: 0,
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          // Wrap with SingleChildScrollView
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              const SizedBox(height: 30),
              // User Profile Section
              Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(
                      height: 40,
                    ),
                    const Text(
                      'User Profile',
                      style: TextStyle(
                        fontSize: 30,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      'Name: ${decodedToken['firstName']} ${decodedToken['lastName']}',
                      style: const TextStyle(
                        fontSize: 19,
                        fontWeight: FontWeight.normal,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      'House: ${house['house']['houseName']}',
                      style: const TextStyle(
                        fontSize: 19,
                        fontWeight: FontWeight.normal,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      'Email: ${decodedToken['email']}',
                      style: const TextStyle(
                        fontSize: 19,
                        fontWeight: FontWeight.normal,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              // Edit Profile Button
              Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Edit your User Profile',
                      style: TextStyle(
                        fontSize: 25,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 20),
                    FloatingActionButton(
                      onPressed: () {},
                      backgroundColor: Colors.blue,
                      heroTag: 'edit_profile',
                      child: const Icon(Icons.edit), // Unique tag for this Hero
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              // Send House Invite Button
              Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Send House Invite Code',
                      style: TextStyle(
                        fontSize: 25,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 20),
                    FloatingActionButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => const EmailInputPage()),
                        );
                      },
                      backgroundColor: Colors.green,
                      heroTag: 'send_invite',
                      child: const Icon(
                          Icons.people_alt), // Unique tag for this Hero
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Logout',
                      style: TextStyle(
                        fontSize: 25,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 20),
                    FloatingActionButton(
                      onPressed: () {
                        logout(context);
                      },
                      backgroundColor: Colors.red,
                      heroTag: 'logout',
                      child: const Icon(
                          Icons.exit_to_app), // Using "exit_to_app" icon
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
