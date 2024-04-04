import 'package:cohab_mobile/web_socket.dart';
import 'token.dart';
import 'package:flutter/material.dart';

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
        taskDescription: taskDescription,
        id: '${tasks.length + 1}',
        completed: false,
      ));
    });
  }

  // Function to toggle the completed status of a task
  void toggleTaskCompletion(int index) {
    setState(() {
      tasks[index].completed = !tasks[index].completed;
    });
  }

  // Function to delete a task
  void deleteTask(int index) {
    setState(() {
      tasks.removeAt(index);
    });
  }

  // Function to show dialog for modifying a task
  void showModifyTaskDialog(BuildContext context, int index) {
    TextEditingController taskController =
    TextEditingController(text: tasks[index].taskDescription);

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Modify Task'),
          content: TextField(
            controller: taskController,
            decoration: const InputDecoration(labelText: 'Task Description'),
          ),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.pop(context); // Close the dialog
              },
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                String updatedTaskDescription = taskController.text;
                if (updatedTaskDescription.isNotEmpty) {
                  setState(() {
                    tasks[index].taskDescription = updatedTaskDescription;
                  });
                  Navigator.pop(context); // Close the dialog
                }
              },
              child: const Text('Save'),
            ),
          ],
        );
      },
    );
  }

  // Function to display the options menu when "more_vert" icon is pressed
  void showOptionsMenu(BuildContext context, int index) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.edit),
                title: const Text('Modify'),
                onTap: () {
                  Navigator.pop(context); // Close the bottom sheet
                  showModifyTaskDialog(context, index); // Show modify task dialog
                },
              ),
              ListTile(
                leading: const Icon(Icons.delete),
                title: const Text('Delete'),
                onTap: () {
                  Navigator.pop(context); // Close the bottom sheet
                  deleteTask(index); // Delete the task
                },
              ),
            ],
          ),
        );
      },
    );
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
              const SizedBox(width: 350),
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
                        toggleTaskCompletion(index);
                      },
                    ),
                    title: Text(tasks[index].taskDescription),
                    trailing: IconButton(
                      icon: const Icon(Icons.more_vert),
                      onPressed: () {
                        showOptionsMenu(context, index);
                      },
                    ),
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
  //String assignedTo;
  //String createdBy;
  bool completed;

  Task({
    required this.taskDescription,
    required this.id,
    required this.completed,
    //required this.assignedTo,
    //required this.createdBy,
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
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('Add Task'),
              content: const TaskInput(),
              actions: <Widget>[
                TextButton(
                  onPressed: () {
                    Navigator.pop(context); // Close the dialog
                  },
                  child: const Text('Cancel'),
                ),
                TextButton(
                  onPressed: () {
                    // Call the onAddTask function with the task entered in the dialog
                    onAddTask(task);
                    Navigator.pop(context); // Close the dialog
                  },
                  child: const Text('Add'),
                ),
              ],
            );
          },
        );
      },
      color: const Color(0xFF14532d),
      padding: EdgeInsets.zero,
      minWidth: 45,
      height: 50,
      child: const Icon(
        Icons.add,
        color: Colors.white,
      ),
    );
  }
}