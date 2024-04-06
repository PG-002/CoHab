import 'package:flutter/material.dart';
import 'web_socket.dart';
import 'token.dart';

// From web (chat.jsx):
//  socket.emit('sendMessage', 
//     {   date: messageDate, 
//         message: messageContent, 
//         sentBy: decodedToken.user._id,
//         firstName : decodedToken.user.firstName });
//         console.log("sentBy is " + decodedToken.user._id);
//         console.log("ID is " +  decodedToken.user._id);
//     setCurrentMessage(''); 
//   };

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();

  // Method to handle sending messages
  void sendMessage(String msg) {
    // Implement sending message logic here
    // For example, you can use the web_socket.dart here
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Roommate Chat"),
      ),
      body: Column(
        children: [
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: TextFormField(
                controller: _messageController,
                decoration: const InputDecoration(
                  hintText: "Message",
                  border: OutlineInputBorder(
                    borderSide: BorderSide(
                      width: 2,
                    ),
                  ),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 20),
            child: Row(
              children: [
                Expanded(
                  child: TextFormField(
                    // This text form field can be used for name or any other information you want to display
                    decoration: const InputDecoration(
                      hintText: "Your Name",
                      border: OutlineInputBorder(
                        borderSide: BorderSide(
                          width: 2,
                        ),
                      ),
                    ),
                  ),
                ),
                IconButton(
                  onPressed: () {
                    sendMessage(_messageController.text);
                    _messageController.clear();
                  },
                  icon: const Icon(
                    Icons.send,
                    color: Colors.green,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }
}