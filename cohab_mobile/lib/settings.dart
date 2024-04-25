import 'package:cohab_mobile/send_join_code.dart';
import 'package:cohab_mobile/token.dart';
import 'package:flutter/material.dart';
import 'web_socket.dart';
import 'main.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  String firstName = ' ';
  String lastName = ' ';

  @override
  void initState() {
    super.initState();
    firstName = decodedToken['firstName'];
    lastName = decodedToken['lastName'];
  }

  void logout(BuildContext context) {
    socket.disconnect();

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const LoginPage()),
    );
  }

  void _editName(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Edit Name'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                initialValue: firstName,
                onChanged: (value) {
                  setState(() {
                    firstName = value;
                  });
                },
                decoration: const InputDecoration(labelText: 'First Name'),
              ),
              TextFormField(
                initialValue: lastName,
                onChanged: (value) {
                  setState(() {
                    lastName = value;
                  });
                },
                decoration: const InputDecoration(labelText: 'Last Name'),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                firstName = decodedToken['firstName'];
                lastName = decodedToken['lastName'];
              },
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                updateUser('firstName', firstName);
                updateUser('lastName', lastName);
                decodedToken['firstName'] = firstName;

                decodedToken['lastName'] = lastName;
                setState(() {});
                Navigator.of(context).pop();
              },
              child: const Text('Save'),
            ),
          ],
        );
      },
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
                    Center(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Name: $firstName $lastName',
                            style: const TextStyle(
                              fontSize: 19,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(
                              width: 10), // Adjust the width as needed
                          FloatingActionButton(
                            onPressed: () {
                              _editName(context);
                            },
                            backgroundColor: const Color(0xFF14532d),
                            heroTag: 'edit_profile',
                            mini: true,
                            child: const Icon(
                              Icons.edit,
                              color: Colors
                                  .white, // Set the color of the icon to white
                            ), // Unique tag for this Hero
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      'House: ${house['house']['houseName']}',
                      style: const TextStyle(
                        fontSize: 19,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      'Email: ${decodedToken['email']}',
                      style: const TextStyle(
                        fontSize: 19,
                        fontWeight: FontWeight.bold,
                      ),
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
              const SizedBox(height: 20),
Center(
  child: Column(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      const Text(
        'Leave House',
        style: TextStyle(
          fontSize: 25,
          fontWeight: FontWeight.bold,
        ),
      ),
      const SizedBox(height: 20),
      SizedBox( // Wrap the button with SizedBox widget and provide width
        width: 200, // Adjust width as needed
        child: FloatingActionButton(
          onPressed: () {
            showDialog(
              context: context,
              builder: (BuildContext context) {
                return AlertDialog(
                  title: const Text('Leave House'),
                  content: const Text(
                      'Are you sure you want to leave the house?'),
                  actions: [
                    TextButton(
                      onPressed: () {
                        Navigator.of(context).pop(); // Close the dialog
                      },
                      child: const Text('Cancel'),
                    ),
                    TextButton(
                      onPressed: () async {
                        await leaveHouse();
                        logout(context);
                      },
                      child: const Text('Confirm'),
                    ),
                  ],
                );
              },
            );
          },
          backgroundColor: Colors.red,
          heroTag: 'Leave House',
          child: const Text(
            'Leave House', // Text for the button
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
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
