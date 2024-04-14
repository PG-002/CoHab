import 'package:cohab_mobile/msg_bubble.dart';
import 'package:flutter/material.dart';
import 'web_socket.dart';
import 'token.dart';
import 'dart:convert';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  List<MsgBubble> messages = []; // List to store chat messages

  // Method to handle sending messages
  void sendMessage(String msg) {
    if (msg.isNotEmpty && token != null) {
      int time = DateTime.now().microsecondsSinceEpoch;
      socket.emit('sendMessage', {
        'message': msg,
        'sentBy': decodedToken['firstName'],
        'email': decodedToken['email'],
        'date': time,
      });
      // Add the sent message to the list of messages
      setState(() {
        messages.add(
          MsgBubble(msg: msg, firstName: decodedToken['firstName']),
        );
      });
      _messageController.clear();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Invalid Message'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Chat Room"),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: messages.length,
              itemBuilder: (context, index) {
                return messages[index];
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 20),
            child: Row(
              children: [
                Expanded(
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
                IconButton(
                  onPressed: () {
                    sendMessage(_messageController.text);
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