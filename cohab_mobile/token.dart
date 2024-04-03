import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:jwt_decoder/jwt_decoder.dart';

var token;
var userId;
var decodedToken;
var users;
bool? isVerified;

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
      userId = decodedToken[
          'userId']; // Accessing the user ID from the decoded token

      print(userIsVerified(decodedToken));
      //userId = decodedToken['token']['userId'];
      print(userId);
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

    print(response.statusCode);
    if (response.statusCode == 201) {
      final jsonResponse = json.decode(response.body);
      token = jsonResponse['token']; // Extracting the token string
      decodedToken = JwtDecoder.decode(token);
      isVerified = jsonResponse['verified'];
      
      //userId
      userId = decodedToken['userId'];
      print(userId);
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

  print("Hello1");
  try {
    final response = await http.post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: json.encode(body),
    );
    print("Hello2");
    if (response.statusCode == 200) {
      token = json.decode(response.body);
      print("Hello3");
      print(userId);
      print('Send failed: ${token['error']}');
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

  // Encode data into JSON format
  final Map<String, String> body = {
    'id': id,
    'code': code,
  };

  try {
    final response = await http.post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      // Encode data as JSON and send in request body
      body: json.encode(body),
    );

    print(response.statusCode);
    if (response.statusCode == 200) {
      final jsonResponse = json.decode(response.body);
      print(jsonResponse);
      print("Verify userIsVerified: ");
      print(userIsVerified(decodedToken));
    } else {
      token = json.decode(response.body);
      print('Send failed: ${token['error']}');
    }
  } catch (e) {
    print('Error occurred: $e');
    // Handle exception
  }
}
