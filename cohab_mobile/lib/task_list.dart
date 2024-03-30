import 'package:flutter/material.dart';
import 'web_socket.dart';


class Task {
  final String id;
  final String task;
  final bool completed;

  Task(this.id, this.task, this.completed);
}

class TaskListPage extends StatelessWidget {
  const TaskListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: TaskList(),
    );
  }
}

class TaskList extends StatefulWidget {


  const TaskList({super.key});

  @override
  createState() => _TaskListState();
}

class _TaskListState extends State<TaskList> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Task List'),
      ),

    );
  }

}

