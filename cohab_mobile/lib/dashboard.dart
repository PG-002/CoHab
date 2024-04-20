import 'package:cohab_mobile/web_socket.dart';
import 'package:flutter/material.dart';
import 'package:flutter_neat_and_clean_calendar/neat_and_clean_calendar_event.dart';
import 'token.dart';
import 'task_list.dart';
import 'calendar.dart';
import 'groupchat.dart';
import 'noise_level.dart';
import 'settings.dart';

late int noiseLevel;
late List<Roommate> statuses = [];

class DashboardPage extends StatefulWidget {
  const DashboardPage({Key? key});

  @override
  createState() => _Dashboard();
}

class _Dashboard extends State<DashboardPage> {
  String _status = '';

  @override
  void initState() {
    super.initState();
    getHouse().then((_) {
      setState(() {
        tasks = house['house']['tasks'].map<Task>((task) {
          return Task(
            id: task['_id'],
            taskDescription: task['task'],
            assignedTo: task['assignedTo'],
            createdBy: task['createdBy'],
            completed: task['completed'],
          );
        }).toList();

        eventList = house['house']['events'].map<NeatCleanCalendarEvent>((event) {
          DateTime startTime = DateTime.parse(event['start']);
          DateTime endTime = DateTime.parse(event['end']);

          return NeatCleanCalendarEvent(
            event['title'],
            metadata: {
              '_id': event['_id'].toString(),
            },
            startTime: startTime,
            endTime: endTime,
            color: Colors.blue,
          );
        }).toList();

        noiseLevel = noise_level;

        statuses = house['house']['statuses'].map<Roommate>((roommate){

          return Roommate(
            roommate['']

          );
        }).toList();
      });
    }).catchError((error) {
      // Handle error if necessary
    });
  }

  // Function to handle the FloatingActionButton onPressed event
  void _changeStatus() async {
    String? newStatus = await showDialog<String>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Change Status'),
          content: TextField(
            decoration: InputDecoration(labelText: 'Enter new status'),
            onChanged: (value) {
              _status = value;
            },
          ),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog without returning any value
              },
              child: Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(_status); // Close the dialog and return the entered value
              },
              child: Text('OK'),
            ),
          ],
        );
      },
    );

    if (newStatus != null) {
      // Handle the new status, e.g., update it in the database or perform any other action
      socket.emit('updateStatus',newStatus);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Dashboard',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: const Color(0xFF14532d),
        iconTheme: const IconThemeData(color: Colors.white),
        titleSpacing: 0,
        centerTitle: true,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            // Your other widgets here
          ],
        ),
      ),
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Text(
            'Status',
            style: TextStyle(
              color: Colors.black, // Change the color of the title if needed
              fontSize: 20, // Adjust font size as needed
              fontWeight: FontWeight.bold, // Adjust font weight as needed
            ),
          ),
          SizedBox(height: 10), // Add some space between the title and the button
          SizedBox(
            width: 65.0, // Adjust width as needed
            height: 65.0, // Adjust height as needed
            child: FloatingActionButton(
              onPressed: _changeStatus,
              tooltip: 'Change Status',
              child: Icon(Icons.emoji_emotions, color: Colors.white),
              backgroundColor: const Color(0xFF14532d),
            ),
          ),
        ],
      ),
    );
  }
}
class Roommate{
  String id;
  String status;
Roommate({
    required this.id,
    required this.status,
  });
}