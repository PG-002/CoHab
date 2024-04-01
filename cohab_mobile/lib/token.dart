import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:jwt_decoder/jwt_decoder.dart';

var token;
var userId;
var decodedToken;
var users;

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
      final jsonResponse = json.decode(response.body);
      token = jsonResponse['token']; // Extracting the token string
      decodedToken = JwtDecoder.decode(token);

      //userId
      userId = decodedToken['user']['_id'];
    } else {
      // Signup failed
      token = json.decode(response.body);
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
      final jsonResponse = json.decode(response.body);
      token = jsonResponse['token']; // Extracting the token string
      decodedToken = JwtDecoder.decode(token);

      //userId
      userId = decodedToken['user']['_id'];
      print("Login UserId: $userId");
    } else {
      // Login failed
      token = json.decode(response.body);
    }
  } catch (e) {
    // Exception occurred
  }
}

bool userIsVerified(Map<String, dynamic> decodedToken) {
  // Check if the decoded token contains user information
  if (decodedToken.containsKey('user')) {
    // Access the user object from the decoded token
    final user = decodedToken['user'];

    // Check if the user object contains the verified field
    if (user.containsKey('verified')) {
      // Return true if the user is verified, false otherwise
      return user['verified'];
    }
  }
  // Return false if user information or verified field is not found
  return false;
}

Future<void> sendVerification(String id) async {
  final Uri url = Uri.parse(
      'https://cohab-4fcf8ee594c1.herokuapp.com/api/users/sendVerification');
  final Map<String, String> body = {
    'id': id,
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
      token = json.decode(response.body);
    } else {
      // Login failed
      token = json.decode(response.body);
      print('Send failed: ${token['error']}');
    }
  } catch (e) {
    // Exception occurred
  }
}

Future<void> verifyUsers(String id, String code) async {
  final Uri url = Uri.parse(
      'https://cohab-4fcf8ee594c1.herokuapp.com/api/users/verifyUser');
  final Map<String, String> body = {
    'id': id,
    'code': code,
  };

  print(id);
  print(code);
  try {
    final response = await http.post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: json.encode(body),
    );
    print(response.statusCode);
    if (response.statusCode == 200) {
      token = json.decode(response.body);
      print("Hi! it works!!");
      //print('Token: ${token['token']}');
    } else {
      print("Hi! it did not work!!");
      token = json.decode(response.body);
      print('Verify failed: ${token['error']}');
    }
  } catch (e) {
    // Exception occurred
  }
}
