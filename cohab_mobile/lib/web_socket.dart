import 'package:socket_io_client/socket_io_client.dart' as io;

class SocketClient {
  static io.Socket? _socket;

  SocketClient._(); // Private constructor to prevent instantiation from outside

  static io.Socket get socket {
    if (_socket == null) {
      _initializeSocket();
    }
    return _socket!;
  }

  static void _initializeSocket() {
    _socket = io.io(
      'https://cohab-4fcf8ee594c1.herokuapp.com/',
      <String, dynamic>{
        'transports': ['websocket'],
        'autoConnect': true,
        'reconnectionDelayMax': 10000,
        'auth': {'token': ''}
      },
    );

    // Add event listeners or other configurations here if needed
    _socket!.onConnect((_) {
      print('Connected to WebSocket');
    });

    _socket!.onDisconnect((_) {
      //print('Disconnected from WebSocket');
    });

    _socket!.on('tasksChange', (data) {
      // Handle updated tasks here
      print('Tasks changed: $data');
      // Update your UI or perform other tasks based on the updated tasks data
    });

    // Add more event listeners or configurations as needed
  }
}