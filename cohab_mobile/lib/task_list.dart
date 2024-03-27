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
    // Your widget build code goes here
    return const MaterialApp(
      home: Scaffold(
        body: MyListView(),
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
          leading: Icon(Icons.star),
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