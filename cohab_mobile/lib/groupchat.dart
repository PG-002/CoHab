import 'package:cohab_mobile/msg_bubble.dart';
import 'package:flutter/material.dart';
import 'web_socket.dart';
import 'token.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

List<Map<String, dynamic>> messages = []; // List to store chat messages

class ChatScreen extends StatefulWidget {
  const ChatScreen({Key? key}) : super(key: key);

  @override
  createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();

  @override
  void initState() {
    super.initState();
    init();
    socket.on('groupChatChange', (data) {
      setState(() {
        messages.clear();
        messages.addAll((data['messages'] as List<dynamic>).cast<Map<String, dynamic>>());
        saveMessages(messages);
      });
    });
    initMessages();
  }

  void sendMessage(String msg) {
    if (msg.isNotEmpty && token != null) {
      int time = DateTime.now().microsecondsSinceEpoch;
      socket.emit('sendMessage', {
        'message': msg,
        'sentBy': decodedToken['firstName'],
        'email': decodedToken['email'],
        'date': time,
      });
      setState(() {
        messages.add({
          'message': msg,
          'sentBy': decodedToken['firstName'],
          'time': _formatDateTime(time),
        });
        saveMessages(messages);
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

  Future<void> saveMessages(List<Map<String, dynamic>> messages) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString('messages', jsonEncode(messages));
  }

  Future<void> initMessages() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? messagesJson = prefs.getString('messages');
    if (messagesJson != null) {
      setState(() {
        messages.clear();
        messages.addAll((jsonDecode(messagesJson) as List<dynamic>).cast<Map<String, dynamic>>());
      });
    }
  }

  void deleteMessage(int index) {
    setState(() {
      messages.removeAt(index);
      saveMessages(messages);
    });
  }

  static String _formatDateTime(int date) {
    // Convert microseconds since epoch to DateTime object
    DateTime dateTime = DateTime.fromMicrosecondsSinceEpoch(date);
    // Format so it's not military time etc.
    String formattedHour = (dateTime.hour > 12 ? dateTime.hour - 12 : (dateTime.hour == 0 ? 12 : dateTime.hour)).toString();
    String formattedMinute = dateTime.minute.toString().padLeft(2, '0'); // Ensure minutes always have two digits
    String amPm = dateTime.hour >= 12 ? 'pm' : 'am';
    String formattedTime = '$formattedHour:$formattedMinute$amPm';
    return formattedTime;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Chat Room',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: const Color(0xFF14532d),
        iconTheme: const IconThemeData(color: Colors.white),
        titleSpacing: 0,
        centerTitle: true,
      ),
      body: Container(
        color: const Color(0xFF262626), // Background color of the chat room
        child: Column(
          children: [
            Expanded(
              child: ListView.builder(
                itemCount: messages.length,
                itemBuilder: (context, index) {
                  return Dismissible(
                    key: Key(messages[index].toString()),
                    direction: messages[index]['sentBy'] == decodedToken['firstName']
                        ? DismissDirection.endToStart
                        : DismissDirection.startToEnd,
                    onDismissed: (direction) {
                      deleteMessage(index);
                    },
                    child: MsgBubble(
                      msg: messages[index]['message'],
                      firstName: messages[index]['sentBy'],
                      time: messages[index]['time'],
                      isCurrentUser: messages[index]['sentBy'] == decodedToken['firstName'],
                      onDelete: () {
                        deleteMessage(index);
                      },
                    ),
                  );
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
                      style: const TextStyle(color: Colors.white), // Text color
                      decoration: InputDecoration(
                        hintText: "Message",
                        hintStyle: TextStyle(color: const Color(0xFF99A3AF)), // Placeholder text color
                        filled: true,
                        fillColor: const Color(0xFF404040), // Message box background color
                        border: OutlineInputBorder(
                          borderSide: BorderSide(
                            width: 2,
                            color: Colors.white, // Border color
                          ),
                        ),
                      ),
                    ),
                  ),
                  IconButton(
                    onPressed: () {
                      sendMessage(_messageController.text);
                    },
                    icon: Icon(
                      Icons.send,
                      color: const Color(0xFF005A44), // Color of the current user's text bubble
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}