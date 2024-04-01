import 'token.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

late io.Socket socket;

Future<void> initSocket() async {
  socket = io.io(
    'https://cohab-4fcf8ee594c1.herokuapp.com/',
    <String, dynamic>{
      'transports': ['websocket'], // Use 'websocket' instead of 'websockets'
      'auth': {'token': decodedToken.toString()},
    },
  );

  // Connect to the WebSocket server
  socket.connect();

  print(socket.connected);
}