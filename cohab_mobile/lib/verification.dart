import 'package:cohab_mobile/houseoptions.dart';
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

  }

  String _verificationCode = '';

  void _handleVerificationCode(String value) {
    setState(() {
      _verificationCode = value;
    });
  }

  void _handleEmail(BuildContext context) async {
    final currentContext = context;

    try {
      await verifyCode(_verificationCode);

      if (!currentContext.mounted) return;

      Navigator.pushReplacement(
        currentContext,
        MaterialPageRoute(builder: (context) => const HouseOptions()),
      );
    } catch (e) {
      if (!currentContext.mounted) return;

      ScaffoldMessenger.of(currentContext).showSnackBar(
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
          width: MediaQuery
              .of(context)
              .size
              .width * 0.8,
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
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10.0),
                  ),
                  hintText: 'Verification Code',
                  hintStyle: const TextStyle(
                    color: Colors.black54,
                    fontFamily: 'Open Sans',
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                      vertical: 15.0, horizontal: 12.0),
                ),
              ),
              const SizedBox(height: 20.0),
              ElevatedButton(
                onPressed: () => _handleEmail(context), // Pass context here
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF14532d),
                ),
                child: const Text(
                  'Submit',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                  ),
                ),
              ),
              const SizedBox(height: 10.0), // Add some space between buttons
              ElevatedButton(
                  onPressed: () async {
                    final currentContext = context; // Store the context in a variable
                    try {
                      await sendCode();
                    } catch (e) {
                      if (!currentContext.mounted) return;
                      ScaffoldMessenger.of(currentContext).showSnackBar(
                        const SnackBar(
                          content: Text('An error occurred. Please try again...'),
                        ),
                      );
                    }
                  },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF14532d),
                ),
                child: const Text(
                  'Send Code',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
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