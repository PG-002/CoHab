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
late List<Task> tasks;

@override
void initState() {
  super.initState();
  tasks = []; // Initialize tasks here
}

// Function to add a task to the tasks list
  void addTask(String taskDescription) {
    setState(() {
      tasks.add(Task(
        taskDescription: taskDescription, // Use taskDescription argument here
        id: '${tasks.length + 1}',
        completed: false,
      ));
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
        backgroundColor: const Color(0xFF14532d),
        iconTheme: const IconThemeData(color: Colors.white),
        titleSpacing: 0,
      ),
      body: Column(
        children: [
          const SizedBox(height: 5),
          Row(
            children: [
              const SizedBox(width: 10),
              const TaskInput(),
              const SizedBox(width: 20),
              AddTasksButton(
                onAddTask: addTask,
              ),
            ],
          ),
          Expanded(
            child: ListView.builder(
              itemCount: tasks.length,
              itemBuilder: (BuildContext context, index) {
                return Card(
                  child: ListTile(
                    leading: Checkbox(
                      value: tasks[index].completed,
                      onChanged: (bool? value) {

                      },
                    ),
                    title: Text(tasks[index].taskDescription),
                    trailing: const Icon(Icons.more_vert),
                  ),
                );
              },

            ),
          ),
        ],
      ),
    );
  }
}

class Task {
  String taskDescription;
  String id;
  bool completed;

  Task({
    required this.taskDescription,
    required this.id,
    required this.completed,
  });
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
  const AddTasksButton({super.key, required this.onAddTask});
  final Function(String) onAddTask;

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
          onAddTask(task);
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
