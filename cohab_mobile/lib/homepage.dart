import 'package:cohab_mobile/calendar.dart';
import 'package:cohab_mobile/task_list.dart';
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Co-Hab Home Page'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // First Icon Button
                SizedBox(
                  width: 120,
                  child: InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const CalendarHomePage()),
                      );
                    },
                    child: Ink(
                      decoration: BoxDecoration(
                        color: const Color(0xFF14532d), // Fill the button with green color
                        borderRadius: BorderRadius.circular(8.0),
                        border: Border.all(color: const Color(0xFF14532d)), // Green border
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          InkWell(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (context) => const CalendarHomePage()),
                              );
                            },
                            child: const Icon(
                              LucideIcons.calendarDays,
                              color: Colors.white,
                              size: 48,
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            'Calendar',
                            style: TextStyle(color: Colors.white, fontSize: 17),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 40), // Adjust spacing between buttons
                // Second Icon Button
                SizedBox(
                  width: 120,
                  child: InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const TaskListPage()),
                      );
                    },
                    child: Ink(
                      decoration: BoxDecoration(
                        color: const Color(0xFF14532d), // Fill the button with green color
                        borderRadius: BorderRadius.circular(8.0),
                        border: Border.all(color: const Color(0xFF14532d)), // Green border
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          InkWell(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (context) => const TaskListPage()),
                              );
                            },
                            child: const Icon(
                              LucideIcons.listChecks,
                              color: Colors.white,
                              size: 48,
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            'Task List',
                            style: TextStyle(color: Colors.white, fontSize: 17),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 80),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Third Icon Button
                SizedBox(
                  width: 120,
                  child: InkWell(
                    onTap: () {
                      // Add your onPressed logic here
                    },
                    child: Ink(
                      decoration: BoxDecoration(
                        color: const Color(0xFF14532d), // Fill the button with green color
                        borderRadius: BorderRadius.circular(8.0),
                        border: Border.all(color: const Color(0xFF14532d)), // Green border
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          InkWell(
                            onTap: () {
                              // Add your onPressed logic here
                            },
                            child: const Icon(
                              LucideIcons.settings,
                              color: Colors.white,
                              size: 48,
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            'Settings',
                            style: TextStyle(color: Colors.white, fontSize: 17),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 40), // Adjust spacing between buttons
                // Fourth Icon Button
                SizedBox(
                  width: 120,
                  child: InkWell(
                    onTap: () {
                      // Add your onPressed logic here
                    },
                    child: Ink(
                      decoration: BoxDecoration(
                        color: const Color(0xFF14532d), // Fill the button with green color
                        borderRadius: BorderRadius.circular(8.0),
                        border: Border.all(color: const Color(0xFF14532d)), // Green border
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          InkWell(
                            onTap: () {
                              // Add your onPressed logic here
                            },
                            child: const Icon(
                              LucideIcons.messageCircle,
                              color: Colors.white,
                              size: 48,
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            'Messages',
                            style: TextStyle(color: Colors.white, fontSize: 17),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}