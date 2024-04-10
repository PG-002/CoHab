import 'package:cohab_mobile/token.dart';
import 'package:flutter/material.dart';

class EmailInputPage extends StatefulWidget {
  const EmailInputPage({super.key});

  @override
  createState() => _EmailInputPageState();
}

class _EmailInputPageState extends State<EmailInputPage> {
  late TextEditingController _emailController;

  @override
  void initState() {
    super.initState();
    _emailController = TextEditingController();
  }

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  void _submitEmail() {
    final String email = _emailController.text.trim();
    // Do something with the email, like send it to an API, save it locally, etc.
    print('Submitted email: $email');
    sendJoinCode(email);
    // You can add further logic here, such as showing a confirmation dialog.
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('             Email Input'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(
                labelText: 'Email Address',
              ),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _submitEmail,
                child: const Text('Submit'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
