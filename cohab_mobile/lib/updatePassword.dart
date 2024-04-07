import 'package:cohab_mobile/main.dart';
import 'package:flutter/material.dart';
import 'token.dart';

class UpdatePasswordPage extends StatefulWidget {
  const UpdatePasswordPage({super.key});

  @override
  createState() => _UpdatePasswordState();
}

class _UpdatePasswordState extends State<UpdatePasswordPage> {
  String _email = '';
  String _newPassword = '';

  void _handleEmail(String value) {
    setState(() {
      _email = value;
    });
  }

  void _handleNewPassword(String value) {
    setState(() {
      _newPassword = value;
    });
  }

  void _handleUpdatePassword(BuildContext context) async {
  // Check if email or password is empty
    if (_email.isEmpty || _newPassword.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please fill in both email and new password.'),
        ),
      );
      return;
    }

    try {
      await updatePassword(_email, _newPassword);
      if (!context.mounted) return;
    
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LoginPage()),
      );
    } catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('An error occurred. Please try again later.'),
        ),
      );
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Update Password'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Please enter your email and new password',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 18.0),
            ),
            const SizedBox(height: 20.0),
            Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Email',
                    style: TextStyle(
                      fontSize: 16.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(
                    width: 350, // Set width of the container
                    child: Container(
                      color: Colors.grey[200],
                      child: TextFormField(
                        onChanged: _handleEmail,
                        obscureText: false,
                        decoration: InputDecoration(
                          hintText: 'Example@gmail.com',
                          hintStyle: const TextStyle(
                              color: Colors.black54, fontFamily: 'Open Sans'),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10.0),
                          ),
                          contentPadding: const EdgeInsets.fromLTRB(
                              12.0, 8.0, 12.0, 8.0),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            const SizedBox(height: 25.0),
            Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'New Password',
                    style: TextStyle(
                      fontSize: 16.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(
                    width: 350, // Set width of the container
                    child: Container(
                      color: Colors.grey[200],
                      child: TextFormField(
                        onChanged: _handleNewPassword,
                        obscureText: true,
                        decoration: InputDecoration(
                          hintText: 'Enter your new password',
                          hintStyle: const TextStyle(
                              color: Colors.black54, fontFamily: 'Open Sans'),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10.0),
                          ),
                          contentPadding: const EdgeInsets.fromLTRB(
                              12.0, 8.0, 12.0, 8.0),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            const SizedBox(height: 25.0),
            Builder(
                builder: (context) => MaterialButton(
                  onPressed: () => _handleUpdatePassword(context),
                  color: const Color(0xFF14532d),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 13.0),
                  child: const SizedBox(
                    width: 350,
                    child: Text(
                      'Update Password',
                      style: TextStyle(
                          color: Colors.white, fontSize: 18, fontFamily: 'Open Sans'),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
