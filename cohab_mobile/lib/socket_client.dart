import 'package:socket_io_client/socket_io_client.dart' as io;
import 'package:shared_preferences/shared_preferences.dart';

class SocketClient {
  static io.Socket? _socket;

  // Private constructor to prevent instantiation from outside
  SocketClient._();

  static io.Socket get socket {
    if (_socket == null) {
      _initializeSocket();
    }
    return _socket!;
  }

  static void _initializeSocket() {
    _socket = io.io('http://localhost:5003', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': true,
      'reconnectionDelayMax': 10000,
      'auth': {'token': '.........'}
    });

    // Add event listeners or other configurations here if needed
  }
}

Future<void> storeToken(String token) async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setString('token', token);
}

Future<String?> getToken() async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getString('token');
}