import 'package:cohab_mobile/houseoptions.dart';
import 'package:cohab_mobile/register.dart';
import 'package:flutter/material.dart';
import 'token.dart';

class VerificationPage extends StatefulWidget {
  const VerificationPage({super.key});

  @override
  createState() => _VerificationPageState();
}

class _VerificationPageState extends State<VerificationPage> {
  @override
  void initState() {
    super.initState();
    // Call sendVerification when the page is initialized
    print(userId);
    sendVerification(userId); // Assuming userId is available
  }

  String _verificationCode = '';

  void _handleVerificationCode(String value) {
    setState(() {
      _verificationCode = value;
    });
  }

  void _handleEmail(BuildContext context) async {
    //print(_verificationCode);
    try {
      await verifyUsers(userId, _verificationCode);
      
      if (_verificationCode.isNotEmpty) {
        // Call a function to verify the code
        // For example, you can send a request to your backend to verify the code
        if (isVerified == true) {
          if (!context.mounted) return;
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const HouseOptions()),
          );
        } else {
          if (!context.mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Verification code is not valid.'),
            ),
          );
        }
      } else {
        // Show an error message indicating that the verification code is empty
        if (!context.mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please enter a verification code.'),
          ),
        );
      }
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
        title: const Text('Email Verification'),
      ),
      body: Center(
        child: Container(
          padding: const EdgeInsets.all(20.0),
          width: MediaQuery.of(context).size.width * 0.8,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const Text(
                'Enter Verification Code:',
                style: TextStyle(
                  fontSize: 18.0,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 10.0),
              TextField(
                onChanged: _handleVerificationCode,
                decoration: const InputDecoration(
                  labelText: 'Verification Code',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 20.0),
              ElevatedButton(
                onPressed: () => _handleEmail(context), // Pass context here
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                ),
                child: const Text(
                  'Submit',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
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
