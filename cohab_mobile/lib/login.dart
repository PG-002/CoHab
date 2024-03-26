import 'package:cohab_mobile/main.dart';
import 'package:flutter/material.dart';
import 'login_token.dart';
import 'register.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  String _email = '';
  String _password = '';

  void _handleEmailChange(String value) {
    setState(() {
      _email = value;
    });
  }

  void _handlePasswordChange(String value) {
    setState(() {
      _password = value;
    });
  }

  void _handleSubmit() async {
  if (!mounted) {
    return; // Widget is unmounted, do nothing
  }

  try {
    await login(_email, _password);

    if (token is String) {
      // Login failed, token is an error message
      if (!mounted) {
        return; // Widget is unmounted, do nothing
      }
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(token),
        ),
      );
    } else if (token is Map<String, dynamic> && token.containsKey('error')) {
      // Login failed, token is a JSON object containing an error message
      if (!mounted) {
        return; // Widget is unmounted, do nothing
      }
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(token['error']),
        ),
      );
    } else {
      // Login successful, navigate to the home screen or any other screen
      if (!mounted) {
        return; // Widget is unmounted, do nothing
      }
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const MyApp()),
      );
    }
  } catch (e) {
    // Handle any exceptions that may occur during login
    print('Error occurred during login: $e');
    if (!mounted) {
      return; // Widget is unmounted, do nothing
    }
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
      body: Center(
        child: Container(
          padding: const EdgeInsets.all(20.0),
          width: MediaQuery.of(context).size.width * 0.8,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const Text(
                'Welcome to CoHab!',
                style: TextStyle(
                  fontSize: 24.0,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20.0),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Email', // Add text here
                    style: TextStyle(
                      fontSize: 16.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 6.0), // Adjust the spacing as needed
                  TextField(
                    onChanged: _handleEmailChange,
                    decoration: const InputDecoration(
                      labelText: 'Email',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10.0),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Password', // Add text here
                    style: TextStyle(
                      fontSize: 16.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 6.0),
                  TextField(
                    onChanged: _handlePasswordChange,
                    obscureText: true,
                    decoration: const InputDecoration(
                      labelText: 'At least 8 characters.',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20.0),
              TextButton(
                onPressed: () {
                  // Implement your forgot password logic here
                },
                child: const Text(
                  'Forgot password?',
                  style: TextStyle(
                    color: Colors.blue, // Set the text color to blue
                  ),
                ),
              ),
              const SizedBox(height: 10.0),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _handleSubmit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF14532D),
                  ),
                  child: const Text(
                    'Login',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 10.0),
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const Register()),
                  );
                },
                child: const Text(
                  'Don\'t have an account? Sign up',
                  style: TextStyle(
                    color: Colors.blue, // Set the text color to blue
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
