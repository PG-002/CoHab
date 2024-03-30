import 'package:flutter/material.dart';
import 'package:web_socket_channel/io.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

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
    return Scaffold(
      body: TaskList(channel: IOWebSocketChannel.connect('wss://cohab-4fcf8ee594c1.herokuapp.com:5003')),
    );
  }
}

class TaskList extends StatefulWidget {
  final WebSocketChannel channel;

  const TaskList({super.key, required this.channel});

  @override
  createState() => _TaskListState();
}

class _TaskListState extends State<TaskList> {
  List<Task> tasks = [];

  @override
  void initState() {
    super.initState();
    // Listen for incoming messages from the WebSocket server
    widget.channel.stream.listen((message) {
      setState(() {
        tasks = (message as List).map((task) => Task(task['id'], task['task'], task['completed'])).toList();
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Task List',
          style: TextStyle(color: Colors.white),
        ),
        centerTitle: true,
        elevation: 1,
        backgroundColor: Colors.black,
      ),
      body: Column( // Wrap with a Column to place multiple widgets vertically
        children: [
          MaterialButton( // Place the MaterialButton within the Column
            onPressed: () {
              // Handle button onPressed event
            },
            color: const Color(0xFF14532d),
            child: const Text(
              'Button Text',
              style: TextStyle(
                color: Colors.white,
              ),
            ),
          ),
          Expanded( // Expanded to ensure the ListView takes up all available space
            child: ListView.builder(
              itemCount: tasks.length,
              itemBuilder: (context, index) {
                final task = tasks[index];
                return ListTile(
                  title: Text(task.task),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.edit),
                        onPressed: () {
                          // Implement modify task functionality
                        },
                      ),
                      IconButton(
                        icon: Icon(task.completed ? Icons.check_box : Icons.check_box_outline_blank),
                        onPressed: () {
                          // Send a message to toggle the completion status of the task
                          widget.channel.sink.add('{"id": "${task.id}", "task": "${task.task}", "completed": ${!task.completed}}');
                        },
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete),
                        onPressed: () {
                          // Send a message to delete the task
                          widget.channel.sink.add('{"id": "${task.id}", "delete": true}');
                        },
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    widget.channel.sink.close();
    super.dispose();
  }
}

