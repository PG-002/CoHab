import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:jwt_decoder/jwt_decoder.dart';

var token;
var userId;
var decodedToken;

bool check = false;

Future<bool> joinHouse(String joinHouseCode) async {
  final Uri url = Uri.parse('https://cohab-4fcf8ee594c1.herokuapp.com/api/users/joinHouse');
  final Map<String, dynamic> body = {
    'userId' : userId,
    'houseId' : houseId,
    'joinCode': joinCode,
  };

  try {
    final response = await http.post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: json.encode(body),
    );

    if (response.statusCode == 200) {
      // Joined house successfully
      // final jsonResponse = json.decode(response.body);
      // token = jsonResponse['token']; // Extracting the token string
      // decodedToken = JwtDecoder.decode(token);
      // userId = decodedToken['user']['_id'];
      check = true;
      return true;
    } else {
      // Join failed
      check = false;
      return false;
    }
  } catch (e) {
    // Exception occurred
    check = false;
    return false;
  }
}
