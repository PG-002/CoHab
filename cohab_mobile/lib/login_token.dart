import 'dart:convert';
import 'package:http/http.dart' as http;

var token;

Future<void> login(String email, String password) async {
  final Uri url = Uri.parse('http://10.194.219.3:5003/api/users/login');
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
      print("Hi! it works!!");
      //print('Token: ${token['token']}');
    } else {
      // Signup failed
      token = json.decode(response.body);
      //print('Login failed: ${token['error']}');
      
    }
  } catch (e) {
    // Exception occurred
    //print('Exception occurred: $e');
  }
}
