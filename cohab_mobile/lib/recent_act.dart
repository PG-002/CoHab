import 'package:flutter/material.dart';

class RecentActivityPage extends StatelessWidget {
  const RecentActivityPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Recent Activity'),
      ),
      body: ListView.builder(
        itemCount: 10, // Number of recent activities
        itemBuilder: (context, index) {
          return ListTile(
            leading: Icon(Icons.history), // Icon for recent activity
            title: Text('Activity $index'), // Title of the recent activity
            subtitle: Text('Details of Activity $index'), // Details of the recent activity
            trailing: Text('10:00 AM'), // Time of the recent activity
            onTap: () {
              // Handle tap on recent activity
            },
          );
        },
      ),
    );
  }
}
