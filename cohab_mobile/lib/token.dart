import 'dart:convert';
import 'package:http/http.dart' as http;

var token;

Future<void> signUp(
    String firstName, String lastName, String email, String password) async {
  final Uri url =
      Uri.parse('https://cohab-4fcf8ee594c1.herokuapp.com/api/users/signup');
  final Map<String, String> body = {
    'firstName': firstName,
    'lastName': lastName,
    'email': email,
    'password': password,
  };

  try {
    final response = await http.post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: json.encode(body),
    );

    if (response.statusCode == 201) {
      // Successful signup
      token = json.decode(response.body);
    } else {
      // Signup failed
    }
  } catch (e) {
    // Exception occurred
  }
}

Future<void> login(String email, String password) async {
  final Uri url =
      Uri.parse('https://cohab-4fcf8ee594c1.herokuapp.com/api/users/login');
  final Map<String, String> body = {
    'email': email,
    'password': password,
  };

  try {
    final response = await http.post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: json.encode(body),
    );

    if (response.statusCode == 201) {
      // Successful signup
      token = json.decode(response.body);
    } else {
      // Signup failed
    }
  } catch (e) {
    // Exception occurred
  }
}
