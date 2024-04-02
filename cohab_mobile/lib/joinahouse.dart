import 'package:flutter/material.dart';
import 'houseoptions.dart';

// Idea to self: Add a right arrow button below the text box.
// When clicked, user proceeds to the landing page.

class JoinAHouse extends StatelessWidget {
  const JoinAHouse({super.key});

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
            ],
          ),
        ),
      ),
    );
  }
}