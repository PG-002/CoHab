import 'package:cohab_mobile/main.dart';
import 'package:flutter/material.dart';

class Register extends StatelessWidget {
  const Register({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        backgroundColor: Colors.white,
        body: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const SizedBox(height:140),
                const Align(alignment: Alignment(-.95,0), child: Text('Welcome To Cohab!', style: TextStyle(color: Colors.black,
                      fontWeight: FontWeight.bold,
                      fontSize: 25,
                      fontFamily: 'Open Sans',
                    ),
                  ),
                ),
                const SizedBox(height: 15),
                const Align(
                  alignment: Alignment(-.95,0),
                  child: Text(
                    'Your all in one roommate assistant',
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 18,
                      fontFamily: 'Open Sans',
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                const Align(
                  alignment: Alignment(-.95,0),
                  child: Text(
                    'Email',
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 16,
                      fontFamily: 'Open Sans',
                    ),
                  ),
                ),
                const SizedBox(height: 5),
                const EmailInput(),
                const SizedBox(height: 20),
                const Align(
                  alignment: Alignment(-.95,0),
                  child: Text(
                    'Password',
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 16,
                      fontFamily: 'Open Sans',
                    ),
                  ),
                ),
                const SizedBox(height: 5),
                const PasswordInput(),
                const SizedBox(height: 5),
                const Align(
                  alignment: Alignment.centerRight,
                  child: ForgotPassword(),
                ),
                const SizedBox(height: 15),
                const RegisterButton(),
                const SizedBox(height: 20),
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.only(right: 8),
                        height: 1,
                        color: Colors.grey[400], // Color of the line
                      ),
                    ),
                    const Text(
                      'Or if you have an account',
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 17,
                        fontFamily: 'Open Sans',
                      ),
                    ),
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.only(left: 8),
                        height: 1,
                        color: Colors.grey[400], // Color of the line
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                const SignIn(),
              ],
            ),
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
      child: const Text('Forgot Password?', style: TextStyle(color: Colors.blue,fontSize: 17)),
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
      padding: const EdgeInsets.symmetric(vertical: 13.0),
      child: const SizedBox(
        width: 350,
        child: Text(
          'Register',
          style: TextStyle(color: Colors.white,fontSize: 17,fontFamily: 'Open Sans'),
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
      child: Container(
        color: Colors.grey[200],
        child: TextFormField(
        decoration: InputDecoration(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10.0),
          ),
          hintText: '   Example@gmail.com',
          hintStyle: const TextStyle(color: Colors.black54,fontFamily: 'Open Sans'),
          contentPadding: const EdgeInsets.symmetric(vertical: 5.0),
        ),
      ),
    )
    );
  }
}

class PasswordInput extends StatelessWidget {
  const PasswordInput({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 350, // Set width of TextFormField
      child: Container(
        color: Colors.grey[200],
        child: TextFormField(
          decoration: InputDecoration(
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10.0),
            ),
            hintText: '   At least 8 characters',
            hintStyle: const TextStyle(color: Colors.black54,fontFamily: 'Open Sans'),
            contentPadding: const EdgeInsets.symmetric(vertical: 5.0), // Adjust the height here
          ),
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
      child: const Text('Sign into Cohab', style: TextStyle(color: Colors.blue,fontFamily: 'Open Sans',fontSize: 17)),
    );
  }
}
