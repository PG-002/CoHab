import 'package:cohab_mobile/main.dart';
import 'package:flutter/material.dart';

class Register extends StatelessWidget {
  const Register({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        backgroundColor: Colors.white,
        body: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Welcome To Cohab!',
              style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 20),
            ),
            const SizedBox(height: 20),
            const Text(
              'Your all in one roommate assistant',
              style: TextStyle(color: Colors.black),
            ),
            const Text('Email'),
            SizedBox(
              width: 250, // Set width of TextFormField
              child: TextFormField(
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10.0),
                  ),
                  hintText: 'Example@gmail.com',
                ),
              ),
            ),
            const SizedBox(height:20),
            const Text('Password'),
            SizedBox(
              width: 250, // Set width of TextFormField
              child: TextFormField(
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10.0),
                  ),
                  hintText: 'At least 8 characters',
                ),
              ),
            ),
            const ForgotPassword(),
          ],
        ),
      ),
    );
  }
}

class ForgotPassword extends StatelessWidget {
  const ForgotPassword({super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // Navigate to ForgotPasswordScreen when text is tapped
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const MyApp()),
        );
      },
      child: const Text('Forgot Password?', style: TextStyle(color: Colors.blue)),
    );
  }
}