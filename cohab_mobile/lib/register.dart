import 'package:cohab_mobile/verification.dart';
import 'package:cohab_mobile/web_socket.dart';
import 'package:flutter/material.dart';
import 'token.dart';
import 'main.dart';

String firstName = '';
String lastName = '';
String email = '';
String password = '';

class Register extends StatefulWidget {
  const Register({super.key});

  @override
  createState() => _RegisterState();
}

class _RegisterState extends State<Register> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        backgroundColor: Colors.white,
        body: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const SizedBox(height: 15),
                const Align(
                  alignment: Alignment.center,
                  child: Text(
                    'Welcome To Cohab!',
                    style: TextStyle(
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                      fontSize: 25,
                      fontFamily: 'Open Sans',
                    ),
                  ),
                ),
                const SizedBox(height: 15),
                const Align(
                  alignment: Alignment.center,
                  child: Text(
                    'Your all in one roommate assistant',
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 18,
                      fontFamily: 'Open Sans',
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                const Align(
                  alignment: Alignment(-.95, 0),
                  child: Text(
                    '   First Name',
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 16,
                      fontFamily: 'Open Sans',
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const FirstNameInput(),
                const SizedBox(height: 20),
                const Align(
                  alignment: Alignment(-.95, 0),
                  child: Text(
                    '   Last Name',
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 16,
                      fontFamily: 'Open Sans',
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const LastNameInput(),
                const SizedBox(height: 20),
                const Align(
                  alignment: Alignment(-.95, 0),
                  child: Text(
                    '   Email',
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 16,
                      fontFamily: 'Open Sans',
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const EmailInput(),
                const SizedBox(height: 20),
                const Align(
                  alignment: Alignment(-.95, 0),
                  child: Text(
                    '   Password',
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 16,
                      fontFamily: 'Open Sans',
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const PasswordInput(),
                const SizedBox(height: 5),
                const Align(
                  alignment: Alignment.centerRight,
                  child: ForgotPassword(),
                ),
                const SizedBox(height: 20),
                const RegisterButton(),
                const SizedBox(height: 25),
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.only(right: 8),
                        height: 1,
                        color: Colors.grey[400], // Color of the line
                      ),
                    ),
                    const Text(
                      'Or if you have an account',
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 18,
                        fontFamily: 'Open Sans',
                      ),
                    ),
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.only(left: 8),
                        height: 1,
                        color: Colors.grey[400], // Color of the line
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                const SignIn(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class ForgotPassword extends StatelessWidget {
  const ForgotPassword({super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // Navigate to ForgotPasswordScreen when text is tapped
      },
      child: const Text('Forgot Password?',
          style: TextStyle(color: Colors.blue, fontSize: 17)),
    );
  }
}

class PasswordInput extends StatefulWidget {
  const PasswordInput({super.key});

  @override
  createState() => _PasswordInputState();
}

class _PasswordInputState extends State<PasswordInput> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  late final TextEditingController _text = TextEditingController();

  void setPassword() {
    password = _text.text;
  }

  @override
  void dispose() {
    _text.dispose(); // Dispose the controller when the state is disposed
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: SizedBox(
        width: 350, // Set width of TextFormField
        child: Container(
          color: Colors.grey[200],
          child: TextFormField(
            controller: _text,
            obscureText: true,
            decoration: InputDecoration(
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10.0),
              ),
              hintText: 'At least 8 characters',
              hintStyle: const TextStyle(
                  color: Colors.black54, fontFamily: 'Open Sans'),
              contentPadding: const EdgeInsets.fromLTRB(
                  12.0, 8.0, 12.0, 8.0), // Add left padding here
            ),
            onChanged: (value) {
              _formKey.currentState!.validate();
              setPassword();
            },
            validator: (String? value) {
              if (value == null || value.isEmpty) {
                return 'Please enter a password';
              } else if (value.length < 8 || value.length > 20) {
                return 'Password must be between 8 and 20 characters';
              } else if (!value.contains(RegExp(r'[A-Z]'))) {
                return 'Password must contain at least one uppercase letter';
              } else if (!value.contains(RegExp(r'[0-9]'))) {
                return 'Password must contain at least one number';
              } else if (!value.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'))) {
                return 'Password must contain at least one special character';
              }
              return null;
            },
          ),
        ),
      ),
    );
  }
}

class EmailInput extends StatefulWidget {
  const EmailInput({super.key});

  @override
  createState() => _EmailInputState();
}

class _EmailInputState extends State<EmailInput> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  String? _emailError;
  late final TextEditingController _text = TextEditingController();

  void setEmail() {
    email = _text.text;
  }

  @override
  void dispose() {
    _text.dispose(); // Dispose the controller when the state is disposed
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: SizedBox(
        width: 350, // Set width of TextFormField
        child: Container(
          color: Colors.grey[200],
          child: TextFormField(
            controller: _text,
            decoration: InputDecoration(
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10.0),
              ),
              hintText: 'Example@gmail.com',
              hintStyle: const TextStyle(
                  color: Colors.black54, fontFamily: 'Open Sans'),
              contentPadding: const EdgeInsets.fromLTRB(
                  12.0, 8.0, 12.0, 8.0), // Add left padding here
              errorText: _emailError,
            ),
            onChanged: (value) {
              setState(() {
                _emailError = null;
              });
              _formKey.currentState!.validate();
              setEmail();
            },
            validator: (String? value) {
              if (value == null || value.isEmpty) {
                return 'Please enter an email';
              } else if (!_isValidEmail(value)) {
                setState(() {
                  _emailError = 'Please enter a valid email';
                });
                _resetError();
                return null;
              }
              return null;
            },
          ),
        ),
      ),
    );
  }

  bool _isValidEmail(String email) {
    // A simple regex for email validation
    // This regex might not cover all valid email formats
    // For production, consider using a more comprehensive solution
    final RegExp emailRegex = RegExp(r'^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$');
    return emailRegex.hasMatch(email);
  }

  void _resetError() {
    Future.delayed(const Duration(seconds: 5), () {
      setState(() {
        _emailError = null;
      });
    });
  }
}

class FirstNameInput extends StatefulWidget {
  const FirstNameInput({super.key});

  @override
  createState() => _FirstNameInputState();
}

class _FirstNameInputState extends State<FirstNameInput> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  String? _firstNameError;
  late final TextEditingController _text = TextEditingController();

  void setFirstName() {
    firstName = _text.text;
  }

  @override
  void dispose() {
    _text.dispose(); // Dispose the controller when the state is disposed
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: SizedBox(
        width: 350, // Set width of TextFormField
        child: Container(
          color: Colors.grey[200],
          child: TextFormField(
            controller: _text,
            decoration: InputDecoration(
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10.0),
              ),
              hintText: 'John',
              hintStyle: const TextStyle(
                  color: Colors.black54, fontFamily: 'Open Sans'),
              contentPadding: const EdgeInsets.fromLTRB(
                  12.0, 8.0, 12.0, 8.0), // Add left padding here
              errorText: _firstNameError,
            ),
            onChanged: (value) {
              setState(() {
                _firstNameError = null;
              });
              _formKey.currentState!.validate();
              setFirstName();
            },
            validator: (String? value) {
              if (value == null || value.isEmpty) {
                setState(() {
                  _firstNameError = 'Please enter your first name';
                });
                _resetError();
                return null;
              }
              return null;
            },
          ),
        ),
      ),
    );
  }

  void _resetError() {
    Future.delayed(const Duration(seconds: 5), () {
      setState(() {
        _firstNameError = null;
      });
    });
  }
}

class LastNameInput extends StatefulWidget {
  const LastNameInput({super.key});

  @override
  createState() => _LastNameInputState();
}

class _LastNameInputState extends State<LastNameInput> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  String? _lastNameError;
  late final TextEditingController _text = TextEditingController();

  void setLastName() {
    lastName = _text.text;
  }

  @override
  void dispose() {
    _text.dispose(); // Dispose the controller when the state is disposed
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: SizedBox(
        width: 350, // Set width of TextFormField
        child: Container(
          color: Colors.grey[200],
          child: TextFormField(
            controller: _text,
            decoration: InputDecoration(
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10.0),
              ),
              hintText: 'Doe',
              hintStyle: const TextStyle(
                  color: Colors.black54, fontFamily: 'Open Sans'),
              contentPadding: const EdgeInsets.fromLTRB(
                  12.0, 8.0, 12.0, 8.0), // Add left padding here
              errorText: _lastNameError,
            ),
            onChanged: (value) {
              setState(() {
                _lastNameError = null;
              });
              _formKey.currentState!.validate();
              setLastName();
            },
            validator: (String? value) {
              if (value == null || value.isEmpty) {
                setState(() {
                  _lastNameError = 'Please enter your last name';
                });
                _resetError();
                return null;
              }
              return null;
            },
          ),
        ),
      ),
    );
  }

  void _resetError() {
    Future.delayed(const Duration(seconds: 5), () {
      setState(() {
        _lastNameError = null;
      });
    });
  }
}

class SignIn extends StatelessWidget {
  const SignIn({super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const LoginPage()),
        );
      },
      child: const Text(
        'Sign into Cohab',
        style: TextStyle(
          color: Colors.blue,
          fontFamily: 'Open Sans',
          fontSize: 18,
        ),
      ),
    );
  }
}

class RegisterButton extends StatelessWidget {
  const RegisterButton({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialButton(
      onPressed: () async {
        var check = checkAgain();
        if (check == null) {
          await signUp(firstName, lastName, email, password);
          // then go to the email verification screen
          init();
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const VerificationPage()),
          );
        } else {
          // Display error message to the user
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(check),
            ),
          );
        }
      },
      color: const Color(0xFF14532d),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
      ),
      padding: const EdgeInsets.symmetric(vertical: 13.0),
      child: const SizedBox(
        width: 350,
        child: Text(
          'Register',
          style: TextStyle(
              color: Colors.white, fontSize: 18, fontFamily: 'Open Sans'),
          textAlign: TextAlign.center, // Align text in the center horizontally
        ),
      ),
    );
  }
}

checkAgain() {
  String? errorMessage;

  if (firstName.isEmpty) {
    return errorMessage = 'Please enter your first name';
  }

  if (lastName.isEmpty) {
    return errorMessage = 'Please enter your last name';
  }

  final RegExp emailRegex = RegExp(r'^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$');
  if (!emailRegex.hasMatch(email)) {
    return errorMessage = 'Please enter a valid email';
  }

  if (password.isEmpty) {
    errorMessage = 'Please enter a password';
  } else if (password.length < 8 || password.length > 20) {
    errorMessage = 'Password must be between 8 and 20 characters';
  } else if (!password.contains(RegExp(r'[A-Z]'))) {
    errorMessage = 'Password must contain at least one uppercase letter';
  } else if (!password.contains(RegExp(r'[0-9]'))) {
    errorMessage = 'Password must contain at least one number';
  } else if (!password.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'))) {
    errorMessage = 'Password must contain at least one special character';
  }

  return errorMessage;
}
