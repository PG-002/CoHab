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
                labelText: '                            Email Address',
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
    // TODO: implement build
    throw UnimplementedError();
  }

}

class NotSent extends StatelessWidget
{
  const NotSent({super.key});

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    throw UnimplementedError();
  }

}

