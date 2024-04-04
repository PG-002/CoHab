import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:jwt_decoder/jwt_decoder.dart';

var token;
var userIds;
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
      userIds = decodedToken[
          'userId']; // Accessing the user ID from the decoded token

      isVerified = decodedToken['verified'];
      print('isVerified: $isVerified');

      print(userIsVerified(decodedToken));
      //userId = decodedToken['token']['userId'];
      print(userIds);
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
      isVerified = decodedToken['verified'];

      //print('isVerified: $isVerified');

      //userId
      userIds = decodedToken['userId'];
      //print(isVerified);
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
      //final jsonResponse = json.decode(response.body);
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

    if (response.statusCode == 200) {
      final jsonResponse = json.decode(response.body);
      print("Hi!");
      print(jsonResponse);

      decodedToken = JwtDecoder.decode(token);
      //isVerified = decodedToken['verified'];
      isVerified = jsonResponse['verified'];
      print('isVerified: $isVerified');

      final isverified = decodedToken['verified'];
      print('isverified: $isverified');

      //print('Verify issue: ${token['error']}');
      //isVerified = jsonResponse['verified'];
      //print(isVerified);
      //print("Verify userIsVerified: ");
      
      print(userIsVerified(decodedToken));
    } else {
      token = json.decode(response.body);
      print('Verify failed: ${token['error']}');
    }
  } catch (e) {
    print('Error occurred: $e');
    // Handle exception
  }
}

bool locateUserIdFromEmail(Map<String, dynamic> decodedToken) {
  // Check if the decoded token contains user information
  if (decodedToken.containsKey('user')) {
    // Access the user object from the decoded token
    final user = decodedToken['user'];

    // Check if the user object contains the verified field
    if (user.containsKey('email')) {
      // Return true if the user is verified, false otherwise
      return user['verified'];
    }
  }
  // Return false if user information or verified field is not found
  return false;
}

Future<void> updatePassword(String id, String password) async {
  final Uri url = Uri.parse(
      'https://cohab-4fcf8ee594c1.herokuapp.com/api/users/updatePassword');

  // Encode data into JSON format
  final Map<String, String> body = {
    'id': id,
    'password': password,
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

    if (response.statusCode == 200) {
      final jsonResponse = json.decode(response.body);
      print(jsonResponse);
    } else {
      token = json.decode(response.body);
      print('Change Password failed: ${token['error']}');
    }
  } catch (e) {
    print('Error occurred: $e');
    // Handle exception
  }
}
