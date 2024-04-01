import 'package:socket_io_client/socket_io_client.dart' as io;

late io.Socket socket;

void initSocket() {
  socket = io.io(
    'https://cohab-4fcf8ee594c1.herokuapp.com',
    <String, dynamic>{
      'reconnectionDelayMax': 10000,
      'auth': {
        'token': ""
      },
    },
  );

  // Connect to the WebSocket server
  socket.connect();

  // Listen to the 'connect' event
  socket.on('connect', (_) {
    print('Socket connected');
    // You can add further actions here if needed
  });

  // Listen to the 'disconnect' event
  socket.on('disconnect', (_) {
    print('Socket disconnected');
    // You can handle disconnect event here
  });
}
