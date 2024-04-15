import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:jwt_decoder/jwt_decoder.dart';

late var token;
late String userId;
late var decodedToken;
late var houseToken;
late var house;
late var sent;
late int noise_level;



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
      'https://cohab-4fcf8ee594c1.herokuapp.com/api/houses/join');
  final Map<String, String> body = {
    'userId': userId,
    'houseId': code,
  };

  try {
    final response = await http.post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: json.encode(body),
    );



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
    'email': decodedToken['email'],
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
      print(jsonResponse);
      sent = jsonResponse['sent'];

      if (sent == false) {
        throw Exception('Failed to send verification code');
      }
    }
  } catch (e) {
    // Exception occurred
    print('$e');
    // You might want to handle this error in your UI
  }
}

Future<void> verifyCode(String code) async {
  final Uri url = Uri.parse(
      'https://cohab-4fcf8ee594c1.herokuapp.com/api/users/verifyCode');
  final Map<String, String> body = {
    'email': decodedToken['email'],
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
      print(jsonResponse);
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

Future<void> createHouse(String houseName) async {
  final Uri url = Uri.parse('https://cohab-4fcf8ee594c1.herokuapp.com/api/houses/createHouse');
  final Map<String, String> body = {
    'userId': userId,
    'houseName': houseName,
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

    if (response.statusCode == 200) {
      final jsonResponse = json.decode(response.body);
      print(jsonResponse);

    }
    else
      {
        throw 'Create House Failed';
      }

  }
  catch (e) {
    // Exception occurred
    throw 'Create House Failed';
  }
}

Future<void> updatePassword(String email, String newPassword) async {
  final Uri url = Uri.parse(
      'https://cohab-4fcf8ee594c1.herokuapp.com/api/users/updatePassword');
  final Map<String, String> body = {
    'email': email,
    'password': newPassword,
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
      print(jsonResponse);
    } else {
      throw 'Updating Password Failed';
    }
  } catch (e) {
    // Exception occurred
    throw 'Updating Password Failed';
  }
}

Future<void> getHouse() async {
  final Uri url = Uri.parse('https://cohab-4fcf8ee594c1.herokuapp.com/api/users/getHouse');
  final Map<String, String> body = {
    'userId': userId,
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

    if (response.statusCode == 200) {
      final jsonResponse = json.decode(response.body);
      houseToken = jsonResponse['token'];
      house = JwtDecoder.decode(houseToken);

      noise_level = house['house']['noiseLevel'];
      print(noise_level);
      print(house);

    }
    else
    {
      throw 'Get House Failed';
    }

  }
  catch (e) {
    // Exception occurred
    throw 'Get House Failed';
  }
}

Future<void> sendJoinCode(String email) async {
  final Uri url = Uri.parse(
      'https://cohab-4fcf8ee594c1.herokuapp.com/api/houses/sendJoinCode');
  final Map<String, String> body = {
    'houseId': house['house']['_id'],
    'email': email,
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
      print(jsonResponse);
      sent = jsonResponse['sent'];

    }
  } catch (e) {
    // Exception occurred
    // You might want to handle this error in your UI
  }
}

Future<void> join(String code) async {
  final Uri url = Uri.parse(
      'https://cohab-4fcf8ee594c1.herokuapp.com/api/users/verifyCode');
  final Map<String, String> body = {
    'email':decodedToken['email'],
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
      print(jsonResponse);

    }
  } catch (e) {
    // Exception occurred
    // You might want to handle this error in your UI
  }
}
