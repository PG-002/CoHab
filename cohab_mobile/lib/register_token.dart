import 'dart:convert';
import 'package:http/http.dart' as http;

var token;

Future<void> signUp(String firstName, String lastName, String email, String password) async {
  final Uri url = Uri.parse('http://10.127.96.231/api/users/signup');
  final Map<String, String> body = {
    'firstName': firstName,
    'lastName': lastName,
    'email': email,
    'password': password,
  };


  try {
    final response = await http.post(
      url,
      body: json.encode(body),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 201) {
      // Successful signup
      token = json.decode(response.body);
      print('Token: ${token['token']}');
    } else {
      // Signup failed
      token = json.decode(response.body);
      print('Signup failed: ${token['error']}');
    }
  } catch (e) {
    // Exception occurred
    print('Exception occurred: $e');
  }
}
