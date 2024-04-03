import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:jwt_decoder/jwt_decoder.dart';

late var token;
late String userId;
late var decodedToken;


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
      userId = decodedToken['userId'];
    } else {
      // Signup failed
      throw 'Signup failed';
    }
  } catch (e) {
    // Exception occurred
    throw 'Signup failed';
  }
}

Future<void> login(String email, String password) async {
  final Uri url = Uri.parse('https://cohab-4fcf8ee594c1.herokuapp.com/api/users/login');
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
      userId = decodedToken['userId'];

      print(userId);
      print(decodedToken['firstName']);

    } else if(response.statusCode == 404) {
      // Login failed
      throw 'Invalid Email';
    }
    else
      {
        throw 'Invalid Password';
      }
  }

  catch (e) {
    // Exception occurred
  }
}

Future<void> joinHouse(String code) async {

  final Uri url = Uri.parse(
      'https://cohab-4fcf8ee594c1.herokuapp.com/api/users/joinHouse');
  final Map<String, String> body = {
    'userId': userId,
    'houseId': code,
    'firstName': decodedToken['firstName'],
    'lastName': decodedToken['lastName']
  };

  try {
    final response = await http.post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: json.encode(body),
    );

    print(response.body);

    final jsonResponse = json.decode(response.body);

     if (jsonResponse['joined'] == true) {
      print("YUESEFES");
     }
  }
  catch (e) {
    // Exception occurred
    print(e);
  }
}

Future<void> sendCode() async {
  final Uri url = Uri.parse(
      'https://cohab-4fcf8ee594c1.herokuapp.com/api/users/sendVerification');
  final Map<String, String> body = {
    'id': userId,
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
      final jsonResponse = json.decode(response.body);
      var sent = jsonResponse['sent'];

      if (sent == false) {
        throw 'User Not Found';
      }
    }
  }
  catch (e) {
    // Exception occurred
  }
}

Future<void> verifyUser(String code) async {
  final Uri url = Uri.parse(
      'https://cohab-4fcf8ee594c1.herokuapp.com/api/users/verifyUser');
  final Map<String, String> body = {
    'id': userId,
    'code': code,
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
      final jsonResponse = json.decode(response.body);
      var verified = jsonResponse['verified'];

      if (verified == false) {
        throw 'Unable to Verify User';
      }
    }
  }
  catch (e) {
    // Exception occurred
  }
}



