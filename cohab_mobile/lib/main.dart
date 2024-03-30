import 'package:cohab_mobile/homepage.dart';
import 'package:cohab_mobile/houseoptions.dart';
import 'package:cohab_mobile/web_socket.dart';
import 'package:flutter/material.dart';
import 'token.dart';
import 'register.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  createState() => _LoginPageState();
}

String _email = '';
String _password = '';

class _LoginPageState extends State<LoginPage> {
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

  Future<void> _handleSubmit(context) async {
    try {
      await login(_email, _password);

      if(check == false) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Invalid email or password'),
            duration: Duration(seconds: 1), // Adjust the duration as needed
          ),
        );
        }
      else if (decodedToken['user']['verified'] == true) {
        _email = '';
        _password = '';

        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const HouseOptions()),
        );


      }
      else {
        //go to email verification screen
        _email = '';
        _password = '';

        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const HouseOptions()),
        );

      }

    }
     catch (e) {
      // Handle any exceptions that may occur during login
    }
  }

  @override
  Widget build(BuildContext context) {
    return
      Scaffold(
        backgroundColor: Colors.white,
        body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                'Welcome to CoHab!',
                style: TextStyle(
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                  fontSize: 25,
                  fontFamily: 'Open Sans',
                ),
              ),
              const SizedBox(height: 25.0),
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
                        onChanged: _handleEmailChange,
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
                    'Password',
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
                        onChanged: _handlePasswordChange,
                        obscureText: true,
                        decoration: InputDecoration(
                          hintText: 'Enter your password',
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
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {
                    // Implement your forgot password logic here
                  },
                  child: const Text(
                    'Forgot password?',
                      style: TextStyle(color: Colors.blue, fontSize: 17),
                  ),
                ),
              ),
              const SizedBox(height: 20.0),
              Builder(
                builder: (context) => MaterialButton(
                  onPressed: () => _handleSubmit(context),
                  color: const Color(0xFF14532d),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 13.0),
                  child: const SizedBox(
                    width: 350,
                    child: Text(
                      'Login',
                      style: TextStyle(
                          color: Colors.white, fontSize: 18, fontFamily: 'Open Sans'),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20.0),
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
                    color: Colors.blue,
                    fontFamily: 'Open Sans',
                    fontSize: 18,
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

void main() {
  init();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Co-Hab',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const LoginPage(),
    );
  }
}
