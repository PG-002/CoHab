import 'package:flutter/material.dart';
import 'package:cohab_mobile/web_socket.dart';
import 'package:flutter/rendering.dart';
import 'homepage.dart';
import 'join_house_api.dart';

class JoinAHouse extends StatefulWidget {
  // const JoinAHouse({super.key});
  const JoinAHouse({super.key});

  @override
  _JoinAHouseState createState() => _JoinAHouseState();
}

class _JoinAHouseState extends State<JoinAHouse> {

  @override
  Widget build(BuildContext context) {
  
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: const Color(0xFFFFFFFF), // Bar color
        leading: IconButton(
          icon: const Icon(Icons.arrow_back), // Back arrow (from LUCIDE)
          onPressed: () {
            Navigator.pop(context); // Goes back to house options when the back arrow is pressed
          },
        ),
      ),
      body: Center( // Wrap the Column with Center
        child: Padding(
          padding: const EdgeInsets.all(20), // Padding for the entire body
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Center(
                child: Text(
                  'Enter your House code:',
                  style: TextStyle(
                    fontSize: 25,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
              ),
              const SizedBox(height: 11), // Padding between text and text box
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 20), // Padding for text box
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(6), // Corner sharpness
                  border: Border.all(color: Colors.black), // Border color
                ),
                child: const TextField(
                  decoration: InputDecoration(
                    border: InputBorder.none, // Remove default border
                    hintText: 'House Code', // Placeholder text
                    hintStyle: TextStyle(color: Color(0x4D17650B)), // 30% opacity
                  ),
                ),
              ),
              const SizedBox(height: 11), // Padding between text box and right arrow
              Align(
                alignment: Alignment.bottomRight,
                child: IconButton(
                  icon: const Icon(Icons.arrow_forward),
                  onPressed: () async {
                    if (check) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const HomePage()),
                      );
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Invalid/Wrong House Code'),
                        duration: Duration(seconds: 1), 
                      ),
                    );
                    }
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}