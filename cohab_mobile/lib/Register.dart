import 'package:flutter/material.dart';

class Register extends StatelessWidget{
  const Register({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Colors.white,

      body: Column(
        children: [
            Text('Welcome To Cohab!',style: TextStyle(color: Colors.black)),
            Text('Your all in one roommate assistant',style: TextStyle(color: Colors.black))
                  ]
      )
    ,
    );
  }
  
}