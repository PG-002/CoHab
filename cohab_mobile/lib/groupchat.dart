import 'package:cohab_mobile/msg_bubble.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'web_socket.dart';
import 'token.dart';
import 'dart:convert';

List<MsgBubble> messages = []; // List to store chat messages

class ChatScreen extends StatefulWidget {
  const ChatScreen({Key? key}) : super(key: key);

  @override
  createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController(); // Add ScrollController

  @override
  void initState() {
    super.initState();
    getHouse().then((_) {
      setState(() {
        // Update tasks with tasks obtained from houseObj
        messages = house['house']['groupChat'].map<MsgBubble>((messages) {
          bool current = false;
          if (messages['sentBy'] == decodedToken['firstName']) {
            current = true;
          }

          // Convert timestamp string to DateTime object
          DateTime timestamp = DateTime.parse(messages['date']);

          // Format DateTime object into a desired format for messaging
          String formattedTimestamp = DateFormat('yyyy-MM-dd hh:mm:ss a').format(timestamp);


          return MsgBubble(
            msg: messages['message'],
            sentBy: messages['sentBy'],
            time: messages['date'].toString(),
            isCurrentUser: current,
            formattedTime: formattedTimestamp,
          );
        }).toList();
        // Scroll to the bottom when messages are loaded
        WidgetsBinding.instance!.addPostFrameCallback((_) {
          _scrollController.jumpTo(_scrollController.position.maxScrollExtent);
        });
      });
    }).catchError((error) {
      // Handle error if necessary
    });

    socket.on('groupChatChange',(data)
    {
      setState(() {
        messages.clear();
        messages = data['messages'].map<MsgBubble>((message) {

          bool current = false;
          if (message['sentBy'] == decodedToken['firstName']) {
            current = true;
          }
          // Convert timestamp string to DateTime object
          DateTime timestamp = DateTime.parse(message['date']);

          // Format DateTime object into a desired format for messaging
          String formattedTimestamp = DateFormat('yyyy-MM-dd hh:mm:ss a').format(timestamp);

          return MsgBubble(
            msg: message['message'],
            sentBy: message['sentBy'],
            time: message['date'].toString(),
            isCurrentUser: current,
            formattedTime: formattedTimestamp,
          );
        }).toList();
      });
    });
  }


  void sendMessage(String new_msg) {
    if (new_msg.isNotEmpty && decodedToken != null) {
      setState(() {
        DateTime time = DateTime.now();
        socket.emit('sendMessage',new_msg);

        String formattedTime = _formatDateTime(time.microsecondsSinceEpoch); // Format DateTime to a string
        messages.add(MsgBubble(
          msg: new_msg,
          sentBy: decodedToken['firstName'],
          time: formattedTime, // Use the formatted time string
          isCurrentUser: true, 
          formattedTime: _formatDateTime(time as int),
        ));
      });
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _scrollController.jumpTo(_scrollController.position.maxScrollExtent);
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


  void deleteMessage(int index) {
    setState(() {
      DateTime time = DateTime.parse(messages[index].time);
      print(socket.connected);
      final Map<String,dynamic> body = {
        'message' : messages[index].msg,
        'sentBy' : messages[index].sentBy,
        'email': decodedToken['email'],
        'date': time.toIso8601String(),
      };
      socket.emit('deleteMessage',body);
      messages.removeAt(index);
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
        backgroundColor: const Color(0xFF0A5B40),
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
                controller: _scrollController, // Assign ScrollController to ListView
                itemCount: messages.length,
                itemBuilder: (context, index) {
                  return Dismissible(
                    key: Key(messages[index].toString()),
                    direction: messages[index].sentBy == decodedToken['firstName']
                        ? DismissDirection.endToStart
                        : DismissDirection.startToEnd,
                    onDismissed: (direction) {
                      deleteMessage(index);
                    },
                    child: MsgBubble(
                      msg: messages[index].msg,
                      sentBy: messages[index].sentBy,
                      time: messages[index].time,
                      isCurrentUser: messages[index].sentBy == decodedToken['firstName'],
                      onDelete: () {
                        deleteMessage(index);
                      }, formattedTime: messages[index].formattedTime,
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
                      color: const Color(0xFF3BCB8E), // Color of the current user's text bubble
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