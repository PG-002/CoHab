import 'package:flutter/material.dart';
import 'web_socket.dart';

class ChatScreen extends StatefulWidget {
  final String name;
  const ChatScreen({super.key, required this.name});
  // const ChatScreen({Key? key, required this.name}) : super(key : key);

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {

  @override
  void initState() {
    super.initState();
  }


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

  void sendMessage (String msg) {

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
            child: TextFormField(
              decoration: const InputDecoration(
                hintText: "Message",
                border: OutlineInputBorder(
                  borderSide: BorderSide(
                    width: 2,
                  )
                )
              ),
            )
            ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 20),
            child: Row(
            children: [
              TextFormField(),
              IconButton(
                onPressed: () {},
                icon: const Icon(
                  Icons.send,
                  color: Colors.green,
                )
              )
            ],
            )
          )
        ]
        )
    );
  }
}