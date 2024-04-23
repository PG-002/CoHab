import 'package:cohab_mobile/main.dart';
import 'package:flutter/material.dart';
import 'token.dart';

class UpdatePasswordPage extends StatefulWidget {
  const UpdatePasswordPage({super.key});

  @override
  createState() => _UpdatePasswordState();
}

class _UpdatePasswordState extends State<UpdatePasswordPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
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

    print('Email: $_email');
    print('New Password: $_newPassword');

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
            Form(
              key: _formKey, 
              child: Column(
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
                        //onChanged: _handleNewPassword,
                        obscureText: true,
                        decoration: InputDecoration(
                          hintText: 'At least 8 characters',
                          hintStyle: const TextStyle(
                            color: Colors.black54,
                            fontFamily: 'Open Sans',
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10.0),
                          ),
                          contentPadding: const EdgeInsets.fromLTRB(12.0, 8.0, 12.0, 8.0),
                        ),
                        onChanged: (value) {
                          _formKey.currentState!.validate();
                          _handleNewPassword(value);
                          
                        },
                        validator: (String? value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter a password';
                          } else if (value.length < 8 || value.length > 20) {
                            return 'Password must be between 8 and 20 characters';
                          } else if (!value.contains(RegExp(r'[A-Z]'))) {
                            return 'Password must contain at least one uppercase letter';
                          } else if (!value.contains(RegExp(r'[0-9]'))) {
                            return 'Password must contain at least one number';
                          } else if (!value.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'))) {
                            return 'Password must contain at least one special character';
                          }
                          return null;
                        },
                      ),
                    ),
                  ),
                ],
              ),
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
