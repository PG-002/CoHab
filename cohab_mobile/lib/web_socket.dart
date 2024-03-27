import 'dart:convert';


import 'package:flutter/material.dart';
import 'package:web_socket_channel/io.dart';
import 'package:web_socket_channel/web_socket_channel.dart';


class WebSocketManager {
  final WebSocketChannel _channel;

  WebSocketManager(String serverAddress) : _channel = IOWebSocketChannel.connect(serverAddress);

  Stream<dynamic> get stream => _channel.stream;

  void sendAction(String action, dynamic data) {
    _channel.sink.add(jsonEncode({'action': action, 'data': data}));
  }

  void dispose() {
    _channel.sink.close();
  }
}

void main() {
  final WebSocketManager manager = WebSocketManager('ws://your_server_address');

  // Listening for messages
  manager.stream.listen((message) {
    // Parse the message
    Map<String, dynamic> data = jsonDecode(message);

    // Handle different actions
    switch (data['action']) {
      case 'api1':
      // Handle API 1
        break;
      case 'api2':
      // Handle API 2
        break;
    // Add cases for other APIs as needed
    }
  });

  // Sending messages
  manager.sendAction('api1', {'param1': 'value1'});
}