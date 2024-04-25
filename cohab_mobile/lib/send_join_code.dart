import 'package:cohab_mobile/token.dart';
//import 'package:flutter/cupertino.dart';
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

  Future<void> _submitEmail() async {
    final String email = _emailController.text.trim();
    // Do something with the email, like send it to an API, save it locally, etc.
    print('Submitted email: $email');

    try {
      await sendJoinCode(email);

      if(sent == false)
        {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const NotSent()),
          );
        }

      else
        {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const Sent()),
          );
        }
    }
    catch(e)
    {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const NotSent()),
      );
    }
    // You can add further logic here, such as showing a confirmation dialog.
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Send Join Code to a Friend!'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 240,),
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(
                labelText: '                                 Email Address',
              ),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 25),
            SizedBox(
              width: double.infinity,
              child: FloatingActionButton(
                backgroundColor: const Color(0xFF14532d),
                onPressed: _submitEmail,
                child: const Text('Submit', style: TextStyle(color: Colors.white,fontSize: 20),),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class Sent extends StatelessWidget
{
  const Sent({super.key});

  @override
  Widget build(BuildContext context) {
    // Delayed navigation function
    void navigateBack() {
      Navigator.pop(context); // Pop the current route off the navigation stack
    }

    // Call navigateBack after 5 seconds
    Future.delayed(const Duration(seconds: 5), navigateBack);

    return Scaffold(
      body: Center(
        child: Container(
          decoration: BoxDecoration(
            border: Border.all(
              color: const Color(0xFF000000),
              width: 2.0,
            ),
            borderRadius: BorderRadius.circular(10.0),
          ),
          padding: const EdgeInsets.all(20.0),
          child: const Column(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'The code was sent!',
                style: TextStyle(fontSize: 22),
              ),
              SizedBox(height: 15),
              Text(
                'Tell your friend to check their email',
                style: TextStyle(fontSize: 20),
              ),
              Text(
                'and',
                style: TextStyle(fontSize: 20),
              ),
              Text(
                ' Input the code',
                style: TextStyle(fontSize: 20),
              ),
            ],
          ),
        ),
      ),
    );
  }

}

class NotSent extends StatelessWidget {
  const NotSent({super.key});

  @override
  Widget build(BuildContext context) {
    // Delayed navigation function
    void navigateBack() {
      Navigator.pop(context); // Pop the current route off the navigation stack
    }

    // Call navigateBack after 5 seconds
    Future.delayed(const Duration(seconds: 5), navigateBack);

    return Scaffold(
      body: Center(
        child: Container(
          decoration: BoxDecoration(
            border: Border.all(
              color: const Color(0xFF000000),
              width: 2.0,
            ),
            borderRadius: BorderRadius.circular(10.0),
          ),
          padding: const EdgeInsets.all(20.0),
          child: const Column(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'The code was not sent.',
                style: TextStyle(fontSize: 22),
              ),
              SizedBox(height: 15),
              Text(
                'Please check the email and try again.',
                style: TextStyle(fontSize: 20),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

