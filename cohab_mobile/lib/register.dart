import 'package:cohab_mobile/main.dart';
import 'package:flutter/material.dart';

class Register extends StatelessWidget {
  const Register({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: Scaffold(
        backgroundColor: Colors.white,
        body: Center(child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Align(alignment:Alignment.centerLeft, child: Text('     Welcome To Cohab!', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 20),)),
            SizedBox(height: 20),
            Align(alignment: Alignment.centerLeft, child: Text('       Your all in one roommate assistant', style: TextStyle(color: Colors.black),)),
            SizedBox(height: 20,),
            Align(alignment: Alignment.centerLeft, child:Text('        Email')),
            EmailInput(),
            SizedBox(height:20),
            Align(alignment: Alignment.centerLeft, child: Text('        Password')),
            PasswordInput(),
            Align(alignment: Alignment(0.8, 0.0), child: ForgotPassword()),
            SizedBox(height: 10),
            RegisterButton(),
            SizedBox(height:10),
            Align(alignment: Alignment.center,child:Text('Or if you have an account')),
            SizedBox(height:5),
            SignIn(),
          ],
        ),
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

class RegisterButton extends StatelessWidget {
  const RegisterButton({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialButton(
      onPressed: () {
        // Define what should happen when the button is pressed
      },
      color: Colors.black54,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
      ),
      child: const SizedBox(
        width: 300,
        child: Text(
          'Register',
          style: TextStyle(color: Colors.white),
          textAlign: TextAlign.center, // Align text in the center horizontally
        ),
      ),
    );
  }
}

class EmailInput extends StatelessWidget {
  const EmailInput({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 350, // Set width of TextFormField
      child: TextFormField(
        decoration: InputDecoration(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10.0),
          ),
          hintText: '   Example@gmail.com',
          contentPadding: const EdgeInsets.symmetric(vertical: 5.0),
        ),
      ),
    );
  }
}

class PasswordInput extends StatelessWidget{
  const PasswordInput({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 350, // Set width of TextFormField
      child: TextFormField(
        decoration: InputDecoration(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10.0),
          ),
          hintText: '   At least 8 characters',
          contentPadding:  const EdgeInsets.symmetric(vertical: 5.0), // Adjust the height here
        ),
      ),
    );
  }
}

class SignIn extends StatelessWidget {
  const SignIn({super.key});

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
      child: const Text('Sign in', style: TextStyle(color: Colors.blue)),
    );
  }
}