import 'token.dart';
import 'package:flutter/material.dart';

class TaskListPage extends StatefulWidget {
  const TaskListPage({super.key});

  @override
  createState() => _TaskListPageState();
}

class _TaskListPageState extends State<TaskListPage> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Task List', style: TextStyle(color: Colors.white)), // Set text color to white
          centerTitle: true,
          elevation: 1, // Add a small elevation to have a visible border
          backgroundColor: Colors.black, // Set background color to black
        ),
        body: const MyListView(),
      ),
    );
  }
}

class MyListView extends StatelessWidget {
  const MyListView({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: const <Widget>[
        ListTile(
          leading: Icon(Icons.add_circle),
          title: Text('Item 1'),
        ),
        ListTile(
          leading: Icon(Icons.star),
          title: Text('Item 2'),
        ),
        ListTile(
          leading: Icon(Icons.star),
          title: Text('Item 3'),
        ),
        // Add more ListTiles as needed
      ],
    );
  }
}