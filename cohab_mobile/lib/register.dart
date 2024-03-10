import 'package:flutter/material.dart';

class Register extends StatelessWidget {
  const Register({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        backgroundColor: Colors.white, // Added comma and corrected closing parenthesis
        body: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Welcome To Cohab!',
              style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold,fontSize: 20), // Making text bold
            ),
            SizedBox(height:20),
            Text(
              'Your all in one roommate assistant',
              style: TextStyle(color: Colors.black),
            ),
            TextFormField(
              decoration: InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10.0),
                ),
                hintText: 'Example@gmail.com',
              ),
            ),
            TextFormField(
              decoration: InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10.0),
                ),
                hintText: 'At least 8 characters',
              ),
            ),
          ],
        ),
      ),
    );
  }
}
