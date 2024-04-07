import 'package:socket_io_client/socket_io_client.dart' as io;
import 'token.dart';

late io.Socket socket;

void init()
{
  socket = io.io(
      'https://cohab-4fcf8ee594c1.herokuapp.com/',
      io.OptionBuilder()
          .setTransports(['websocket']) // Set transports to WebSocket
          .setExtraHeaders({'token': token})
          .build()
  );

  // Listen for the 'connect' event
  socket.onConnect((_) {
    print('Socket connected');
    // You can add any further actions you want to perform upon successful connection here
  });

  // Listen for the 'connect_error' event
  socket.onConnectError((error) {
    print('Connection error: $error');
    // Handle connection error if necessary
  });

  // Connect the socket
  socket.connect();

}
