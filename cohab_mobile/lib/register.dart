import 'package:flutter/material.dart';

class Register extends StatelessWidget {
  const Register({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          Text(
            'Welcome To Cohab!',
            style: TextStyle(color: Colors.black),
          ),
          Text(
            'Your all in one roommate assistant',
            style: TextStyle(color: Colors.black),
          ),
          Container(
            child: TextFormField(
              decoration: InputDecoration(
                labelText: 'Email',
                hintText: 'Example@gmail.com'
              ),
            ),
          ),
        ],
      ),
    );
  }