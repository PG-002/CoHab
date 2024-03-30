import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
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
        title: const Text(
          '                     Task List',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: const Color(0xFF14532d),
        iconTheme: const IconThemeData(color: Colors.white),
        titleSpacing: 0, // Adjust the spacing
      ),
      body: const Column(
        children: [
          SizedBox(height: 20),
          AddTasksButton(),
        ],
      ),
    );
  }
}



class AddTasksButton extends StatelessWidget {
  const AddTasksButton({super.key});

  @override
  Widget build(BuildContext context) {
    return ClipOval(
      child: Material(
        color: const Color(0xFF14532d),
        child: InkWell(
          onTap: () {},
          child: const SizedBox(
            width: 50, // Increase width to make the icon bigger
            height: 50, // Increase height to make the icon bigger
            child: Icon(
              LucideIcons.plusCircle,
              color: Colors.white,
              size: 36, // Adjust the size of the icon
            ),
          ),
        ),
      ),
    );
  }
}