import 'package:flutter/material.dart';
import 'token.dart';
import 'task_list.dart';
import 'calendar.dart';
import 'groupchat.dart';
import 'noise_level.dart';
import 'settings.dart';

late int num_tasks;
late int num_chats;
late int events_today;
late int noise_level;

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});


  @override
 createState() => _Dashboard();
}

class _Dashboard extends State<DashboardPage> {

  @override
  Future<void> initState() async {
    super.initState();
    await getHouse();
    // Add any initialization tasks here
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('             Dashboard'),
      ),
      body: Center(
        child: Column(
          children: <Widget>[
            SizedBox(height: 20,),
            Text(
                'Most Recent Tasks'
            ),
            Text(
                'Most Recent Tasks'
            ),
            Text(
                'Most Recent Tasks'
            ),
            Text(
                'Most Recent Tasks'
            ),
          ],
        ),
      ),
    );
  }
}