import 'package:cohab_mobile/web_socket.dart';
import 'token.dart';
import 'package:flutter/material.dart';

String task = '';
String assignedTo = '';


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
  late List<Task> tasks = [];

  @override
  void initState() {
    super.initState();
    getHouse().then((_) {
      setState(() {
        // Update tasks with tasks obtained from houseObj
        tasks = house['house']['tasks'].map<Task>((task) {
          return Task(
            id: task['_id'],
            taskDescription: task['task'],
            assignedTo: task['assignedTo'],
            createdBy: task['createdBy'],
            completed: task['completed'],
          );
        }).toList();
      });
    }).catchError((error) {
      // Handle error if necessary
    });
  }


  // Function to add a task to the tasks list
  void addTask(String taskDescription) async {
    // Store a reference to the original tasks list
    List<Task> originalTasks = List.of(tasks);

    // Add the task to the tasks list with a temporary 'null' ID
    setState(() {
      tasks.add(Task(
        id: 'null',
        taskDescription: taskDescription,
        assignedTo: assignedTo,
        createdBy: decodedToken['firstName'],
        completed: false,
      ));
    });

    // Emit the task creation event
    final Map<String, String> body = {
      'task': taskDescription,
      'assignedTo': assignedTo,
    };
    socket.emit('createTask', body);

    // Fetch the house information again
    try {
      await getHouse();
      // Check for tasks with 'null' id in the updated house information
      for (Task originalTask in originalTasks) {
        if (originalTask.id == 'null') {
          // Find the corresponding task in the updated house information
          var houseTasks = house['house']['tasks'];
          var updatedTask = houseTasks.firstWhere((task) =>
          task['task'] == taskDescription &&
              task['assignedTo'] == assignedTo &&
              task['createdBy'] == decodedToken['firstName'] &&
              task['completed'] == false);

          // Update the id of the task
          setState(() {
            originalTask.id = updatedTask['_id'];
          });
        }
      }
    } catch (error) {

      // Handle error if necessary
    }


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

      final Map<String,dynamic> body = {
        '_id': tasks[index].id,
        'task': tasks[index].taskDescription,
        'assignedTo': tasks[index].assignedTo,
        'createdBy': tasks[index].createdBy,
        'completed': tasks[index].completed,

      };

      socket.emit('deleteTask',body);

      tasks.removeAt(index);
    });

  }

  void showModifyTaskDialog(BuildContext context, int index) {
    TextEditingController taskController =
    TextEditingController(text: tasks[index].taskDescription);
    TextEditingController assignedToController =
    TextEditingController(text: tasks[index].assignedTo);

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Modify Task'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: taskController,
                decoration: const InputDecoration(labelText: 'Task Description'),
              ),
              const SizedBox(height: 10), // Add some space between the two text fields
              TextField(
                controller: assignedToController,
                decoration: const InputDecoration(labelText: 'Assigned To'),
              ),
            ],
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
                String updatedAssignedTo = assignedToController.text;
                if (updatedTaskDescription.isNotEmpty) {
                  setState(() {
                    tasks[index].taskDescription = updatedTaskDescription;
                    tasks[index].assignedTo = updatedAssignedTo;

                    final Map<String,dynamic> body = {
                      '_id': tasks[index].id,
                      'task': tasks[index].taskDescription,
                      'assignedTo': tasks[index].assignedTo,
                      'createdBy': tasks[index].createdBy,
                      'completed': tasks[index].completed,

                    };

                    socket.emit('modifyTask',body);

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
                  // Show confirmation dialog before deleting
                  showDeleteConfirmationDialog(context, index);
                },
              ),
              ListTile(
                leading: const Icon(Icons.person),
                title: const Text('Assigned To'),
                onTap: () {
                  Navigator.pop(context); // Close the bottom sheet
                  // Show assigned to information dialog
                  showAssignedToDialog(context, tasks[index].assignedTo);
                },
              ),
            ],
          ),
        );
      },
    );
  }

// Function to show assigned to information dialog
  void showAssignedToDialog(BuildContext context, String assignedTo) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Assigned To'),
          content: Text('This task is assigned to: $assignedTo'),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.pop(context); // Close the dialog
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }

// Function to show confirmation dialog before deleting a task
  void showDeleteConfirmationDialog(BuildContext context, int index) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Delete Task'),
          content: const Text('Are you sure you want to delete this task?'),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.pop(context); // Close the dialog
              },
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(context); // Close the dialog
                deleteTask(index); // Delete the task
              },
              child: const Text('Delete'),
            ),
          ],
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
  String id;
  String taskDescription;
  String assignedTo;
  String createdBy;
  bool completed;

  Task({
    required this.id,
    required this.taskDescription,
    required this.completed,
    required this.assignedTo,
    required this.createdBy,
  });
}

class TaskInput extends StatefulWidget {
  const TaskInput({super.key});

  @override
   createState() => _TaskInputState();
}

class _TaskInputState extends State<TaskInput> {
  final TextEditingController _taskTextController = TextEditingController();
  final TextEditingController _assignedToTextController = TextEditingController();

  void setTaskAndAssignedTo() {
    task = _taskTextController.text;
    assignedTo = _assignedToTextController.text;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextFormField(
          controller: _taskTextController,
          decoration: InputDecoration(
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10.0),
            ),
            hintText: 'Enter task here',
          ),
          onChanged: (_) => setTaskAndAssignedTo(),
        ),
        const SizedBox(height: 10), // Add some space between the two text fields
        TextFormField(
          controller: _assignedToTextController,
          decoration: InputDecoration(
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10.0),
            ),
            hintText: 'Assigned to',
          ),
          onChanged: (_) => setTaskAndAssignedTo(),
        ),
      ],
    );
  }

  @override
  void dispose() {
    _taskTextController.dispose();
    _assignedToTextController.dispose();
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

