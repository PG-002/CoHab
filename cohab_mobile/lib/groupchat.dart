import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class ChatScreen extends StatefulWidget {
  final String name;
  const ChatScreen({super.key});
  // const ChatScreen({Key? key, required this.name}) : super(key : key);

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  IO.socket? socket;
  @override
  void initState() {
    super.initState();
    connect();
  }

// ===================== Web socket =====================
// From https://pub.dev/packages/socket_io_client:
// import 'package:socket_io_client/socket_io_client.dart' as IO;

// main() {
//   // Dart client
//   IO.Socket socket = IO.io('http://localhost:3000');
//   socket.onConnect((_) {
//     print('connect');
//     socket.emit('msg', 'test');
//   });
//   socket.on('event', (data) => print(data));
//   socket.onDisconnect((_) => print('disconnect'));
//   socket.on('fromServer', (_) => print(_));
// }

  void connect() {
    socket = IO.io('https://cohab-4fcf8ee594c1.herokuapp.com/api/Models/House', <String, dynamic> {
      "transports": ["websocket"],
      "autoConnect": false, 
    });
    socket!.connect();
    socket!.onConnect((_) {
      print('connect');
    });
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
    socket!.emit('message', {
      
    });
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
    )
  }
}