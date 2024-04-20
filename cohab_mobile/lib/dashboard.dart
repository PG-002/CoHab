import 'package:flutter/material.dart';
import 'package:flutter_neat_and_clean_calendar/neat_and_clean_calendar_event.dart';
import 'token.dart';
import 'task_list.dart';
import 'calendar.dart';
import 'groupchat.dart';
import 'noise_level.dart';
import 'settings.dart';


late int noiseLevel;

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});


  @override
 createState() => _Dashboard();
}

class _Dashboard extends State<DashboardPage> {

  @override
  void initState(){
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

        // Update tasks with tasks obtained from houseObj
        eventList = house['house']['events'].map<NeatCleanCalendarEvent>((event) {
          DateTime startTime = DateTime.parse(event['start']);
          DateTime endTime = DateTime.parse(event['end']);

          return NeatCleanCalendarEvent(
            event['title'],
            metadata: {
              '_id': event['_id'].toString(), // Here you can add any key-value pairs you want
            },
            startTime: startTime,
            endTime: endTime,
            color: Colors.blue,
          );
        }).toList();

        noiseLevel = noise_level;
      });
    }).catchError((error) {
      // Handle error if necessary
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('             Dashboard'),
      ),
      body: Center(
        child: Column(
          children: <Widget>[
            SizedBox(height: 20,),
            Text(
                'Roommates'
            ),
            Text(
                'Most Recent Tasks'
            ),
            Text(
                'Upcoming Events'
            ),
            Text(
                'Current Noise Level'
            ),
            Text(
                'Recent Messages'
            ),
          ],
        ),
      ),
    );
  }
}