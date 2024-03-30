import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

late io.Socket socket;

  void init() {
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
  }
