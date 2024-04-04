import 'package:cohab_mobile/homepage.dart';
import 'package:flutter/material.dart';
import 'joinahouse.dart'; 

// Note to self: looks too bare, add perhaps an image or icon somewhere


class HouseOptions extends StatelessWidget {
  const HouseOptions({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          SizedBox(
            width: MediaQuery.of(context).size.width,
            height: MediaQuery.of(context).size.height * 0.5,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const SizedBox(height: 20),
                const Align(
                  alignment: Alignment.centerLeft,
                  child: Padding(
                    padding: EdgeInsets.only(left:20), // Padding on the left of the screen
                      child: Center(
                        child: Text(
                          'Almost There!',
                          style: TextStyle(
                            color: Colors.black,
                            fontWeight: FontWeight.bold,
                            fontSize: 25,
                            fontFamily: 'Open Sans',
                          ),
                        ),
                      ),
                  ),
                ),
                const SizedBox(height: 25),
                Align(
                  alignment: Alignment.center,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 20), // Equal padding on both sides
                    child: const Wrap(
                      children: [
                        Text(
                          'Join a house by entering an existing code',
                          style: TextStyle(
                            color: Colors.black,
                            fontSize: 18,
                            fontFamily: 'Open Sans',
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 100), // Adjust as needed
                  child: Row(
                    children: [
                      Expanded(
                        child: Container(
                          margin: const EdgeInsets.only(right: 8),
                          height: 1,
                          color: Colors.grey[400], // Color of the line
                        ),
                      ),
                      const Text(
                        'Or',
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 18,
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
                ),
                const SizedBox(height: 10),
                const Text(
                    'Create a house with your roomates',
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 18,
                    fontFamily: 'Open Sans',
                  ),
                ),
                const SizedBox(height: 50), // Padding between texts and buttons
                SizedBox(
                  width: 200,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const JoinAHouse(), // Redirects to joinahouse.dart
                      ));
                    },
                    style: ElevatedButton.styleFrom(
                      foregroundColor: const Color(0xFFFFFFFF), // Text color (button)
                      backgroundColor: const Color(0xFF17650B),  // Button color
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(6), 
                      ),
                    ),
                    child: const Text(
                      'Join a House',
                      style: TextStyle(fontSize: 16, color: Color(0xFFFFFFFF)),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: 200,
                  child: ElevatedButton(
                    onPressed: () {
                      debugPrint('Create a House button pressed...');
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const HomePage()),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      foregroundColor: const Color(0xFFFFFFFF), // Text color (button)
                      backgroundColor: const Color(0xFF17650B),  // Button color
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(6),
                      ),
                    ),
                    child: const Text(
                      'Create a House',
                      style: TextStyle(fontSize: 16, color: Color(0xFFFFFFFF)),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
