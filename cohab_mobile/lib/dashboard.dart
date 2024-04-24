import 'package:cohab_mobile/web_socket.dart';
import 'package:flutter/material.dart';
import 'package:flutter_neat_and_clean_calendar/neat_and_clean_calendar_event.dart';
import 'token.dart';
import 'task_list.dart';
import 'calendar.dart';
import 'groupchat.dart';
import 'settings.dart';
import 'package:intl/intl.dart';

late int noiseLevel = 0;
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
      //array of tasks
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

        eventList =
            house['house']['events'].map<NeatCleanCalendarEvent>((event) {
          //array of calendar events
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

        noiseLevel = noise_level; //the current noise level

        /*statuses = house['house']['statuses'].map<Roommate>((roommate) {
          String? tempname = getUsersStatus(roommate['userId']) ;

          

          return Roommate(
            id: roommate['userId'],
            status: roommate['status'],
            name: tempname,
          );
        }).toList();*/

        Future<void> loadStatuses() async {
          List<Roommate> updatedStatuses = [];
          List<dynamic> houseStatuses = house['house']['statuses'];

          for (var roommate in houseStatuses) {
            String? tempname = await getUsersStatus(roommate['userId']);
            print(tempname); // This will print the retrieved name or null
            updatedStatuses.add(
              Roommate(
                id: roommate['userId'],
                status: roommate['status'],
                name: tempname,
              ),
            );
          }
        

          setState(() {
            statuses = updatedStatuses;
          });
        }

        loadStatuses();
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
                Navigator.of(context)
                    .pop(); // Close the dialog without returning any value
              },
              child: Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(
                    _status); // Close the dialog and return the entered value
              },
              child: Text('OK'),
            ),
          ],
        );
      },
    );

    if (newStatus != null) {
      // Handle the new status, e.g., update it in the database or perform any other action
      socket.emit('updateStatus', newStatus);
    }
  }

  @override
  Widget build(BuildContext context) {
    String formattedDate = DateFormat('M/d/y').format(DateTime.now());
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
      body: Stack(
        children: [
          Positioned(
            bottom: 425,
            right: 10,
            child: Container(
              height: 250,
              constraints: BoxConstraints(
                maxWidth: MediaQuery.of(context).size.width * 0.40
              ),
              margin: const EdgeInsets.all(10),
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFF404040),
                shape: BoxShape.rectangle,
                border: Border.all(color: Colors.grey),
                borderRadius: BorderRadius.circular(20),
              ),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Statuses:',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white
                      ),
                    ),
                    const SizedBox(height: 10),
                    SizedBox(
                      height: 150,
                      child: ListView.builder(
                        itemCount: statuses.length,
                        itemBuilder: (context, index) {
                          return Container(
                            margin: const EdgeInsets.symmetric(vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFF14532d),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: ListTile(
                              title: Text(
                                statuses[index].name ?? 'Unknown',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              subtitle: Text(
                                statuses[index].status,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        Positioned(
          bottom: 10,
          left: 10,
          child: Container(
            height: 390,
            constraints: BoxConstraints(
              maxWidth: MediaQuery.of(context).size.width * 0.45,
            ),
            margin: const EdgeInsets.all(10),
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFF404040),
              shape: BoxShape.rectangle,
              border: Border.all(color: Colors.grey),
              borderRadius: BorderRadius.circular(20),
            ),
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Recent Tasks:',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 10),
                  if (tasks.isEmpty)
                  const Text(
                    'No tasks available',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  )
                  else
                  Column(
                    children: tasks.map((task) {
                      return Container(
                        margin: const EdgeInsets.only(bottom: 10),
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: const Color(0xFF14532d),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              task.taskDescription,
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              'Created By: ${task.createdBy}',
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              'Assigned To: ${task.assignedTo}',
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(
                              height: 10,
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ],
              ),
            ),
          ),
        ),

        Positioned(
          bottom: 425, 
          left: 10,
          child: Container(
            constraints: BoxConstraints(
              maxWidth: MediaQuery.of(context).size.width * 0.45,
            ),
            margin: const EdgeInsets.all(10),
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFF404040),
              shape: BoxShape.rectangle,
              border: Border.all(color: Colors.grey),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Noise Level:',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFF14532d), 
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  'Current Noise Level: $noiseLevel',
                  style: const TextStyle(
                    fontSize: 16,
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),

            ],
          ),
        ),
      ),
      Positioned(
        bottom: 10,
        right: 10,
        child: Container(
          height: 390,
          constraints: BoxConstraints(
            maxWidth: MediaQuery.of(context).size.width * 0.4,
          ),
          margin: const EdgeInsets.all(10),
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: const Color(0xFF404040),
            shape: BoxShape.rectangle,
            border: Border.all(color: Colors.grey),
            borderRadius: BorderRadius.circular(20),
          ),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Events for:\n $formattedDate',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 10),
                if (eventList.isEmpty || eventList.where((event) {
                  DateTime currentDate = DateTime.now();
                  String formattedCurrentDate = DateFormat('yyyy-MM-dd').format(currentDate);
                  String formattedStartTime = DateFormat('yyyy-MM-dd').format(event.startTime);
                  return formattedStartTime == formattedCurrentDate;
                }).isEmpty)
                const Text(
                  'No events for today',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                )
                else ...eventList.where((event) {
                  DateTime currentDate = DateTime.now();
                  String formattedCurrentDate = DateFormat('yyyy-MM-dd').format(currentDate);
                  String formattedStartTime = DateFormat('yyyy-MM-dd').format(event.startTime);
                  return formattedStartTime == formattedCurrentDate;
                }).map((event) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: const Color(0xFF14532d),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          event.summary,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          '${DateFormat('h:mm a').format(event.startTime)} - ${DateFormat('h:mm a').format(event.endTime)}',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  );
                }),
             ],
            ),
          ),
        ),
      ),
      ],
    ),
    floatingActionButton: Stack(
      children: [
        Positioned(
          top: 150,
          left: 40,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              Tooltip(
                message: 'Change Status',
                textStyle: const TextStyle(color: Colors.black),
                child: SizedBox(
                  width: 65.0,
                  height: 65.0,
                  child: FloatingActionButton(
                    onPressed: _changeStatus,
                    backgroundColor: const Color(0xFF14532d),
                    child: const Icon(Icons.emoji_emotions, color: Colors.white),
                  ),
                ),
              ),
              const SizedBox(height: 8), // Add some space between the button and the text
              const Text(
                'Change Status',
                style: TextStyle(color: Colors.black),
              ),
            ],
          ),
        ),
      ],
    ),

    );
    
  }
  

}

class Roommate {
  String id;
  String? name;
  String status;
  Roommate({
    required this.id,
    required this.status,
    required this.name,
  });
}
