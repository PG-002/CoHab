import 'package:flutter/material.dart';
import 'web_socket.dart';

String task = '';


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
  List<Task> tasks = [];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Task List',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: const Color(0xFF14532d),
        iconTheme: const IconThemeData(color: Colors.white),
        titleSpacing: 0,
      ),
      body: Column(
        children: [
          const SizedBox(height: 5),
          const Row(
            children: [
              SizedBox(width: 10),
              TaskInput(),
              SizedBox(width: 20),
              AddTasksButton(),
            ],
          ),
          Expanded(
            child: ListView.builder(
              itemCount: tasks.length,
              itemBuilder: (context, index) {
                final task = tasks[index];
                return const TaskItem(
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class TaskItem extends StatelessWidget {
  const TaskItem({super.key});


  @override
  Widget build(BuildContext context) {
    return ListTile(
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          IconButton(
            icon: const Icon(Icons.edit), onPressed: () {  },
          ),
          IconButton(
            icon: const Icon(Icons.delete), onPressed: () {  },
          ),
        ],
      ),
    );
  }
}

class TaskInput extends StatefulWidget {
  const TaskInput({super.key});

  @override
  createState() => _TaskInputState();
}

class _TaskInputState extends State<TaskInput> {
  final TextEditingController _textController = TextEditingController();

  void setTask()
  {
    task = _textController.text;
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 300,
      child: TextFormField(
        controller: _textController,
        decoration: InputDecoration(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10.0),
          ),
          hintText: 'Enter task here',
        ),
        onChanged: (value) {
          setTask();
          },
      ),
    );
  }

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

}

class AddTasksButton extends StatelessWidget {
  const AddTasksButton({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialButton(
      onPressed: () {
        if (task.isEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Please enter a task.'),
              duration: Duration(seconds: 1), // Set duration to 2 seconds
            ),
          );
        } else {
          // Perform action when the task is not empty
        }
      },
      color: const Color(0xFF14532d),
      padding: EdgeInsets.zero,
      minWidth: 40,
      height: 50,
      child: const Icon(
        Icons.add,
        color: Colors.white,
      ),
    );
  }
}

class Task {
  final String id;
  final String task;
  final bool completed;

  Task(this.id, this.task, this.completed);
}
