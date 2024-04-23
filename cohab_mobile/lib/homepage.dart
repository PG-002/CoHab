import 'package:cohab_mobile/calendar.dart';
import 'package:cohab_mobile/dashboard.dart';
import 'package:cohab_mobile/groupchat.dart';
import 'package:cohab_mobile/location.dart';
import 'package:cohab_mobile/noise_level.dart';
import 'package:cohab_mobile/settings.dart';
import 'package:cohab_mobile/task_list.dart';
import 'package:flutter/material.dart';
import 'token.dart';
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
        title: Text('${house['house']['houseName']} Home Page',style: TextStyle(color: Colors.white),),
        centerTitle: true,
        backgroundColor: const Color(0xFF14532d),
        iconTheme: const IconThemeData(color: Colors.white),
        automaticallyImplyLeading: false,
      ),
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(
                width: 120,
                child: InkWell(
                  onTap: () async {
                    getHouse().then((_) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => DashboardPage()),
                      );
                    });
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
                          onTap: () async {
                            getHouse().then((_) {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (context) => DashboardPage()),
                              );
                            });
                          },
                          child: const Icon(
                            LucideIcons.layoutDashboard,
                            color: Colors.white,
                            size: 48,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Dashboard',
                          style: TextStyle(color: Colors.white, fontSize: 17),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              SizedBox(height: 80),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 120,
                    child: InkWell(
                      onTap: () async {
                        getHouse().then((_) {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => NoiseLevelPage()),
                          );
                        });
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
                              onTap: () async {
                                getHouse().then((_) {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(builder: (context) => NoiseLevelPage()),
                                  );
                                });
                              },
                              child: const Icon(
                                LucideIcons.music,
                                color: Colors.white,
                                size: 48,
                              ),
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              'Noise Level',
                              style: TextStyle(color: Colors.white, fontSize: 17),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 40),
                  SizedBox(
                    width: 120,
                    child: InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const LocationTrackerPage()),
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
                                  MaterialPageRoute(builder: (context) => const LocationTrackerPage()),
                                );
                              },
                              child: const Icon(
                                LucideIcons.locateFixed,
                                color: Colors.white,
                                size: 48,
                              ),
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              'Locator',
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
                  const SizedBox(width: 40),
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
                  SizedBox(
                    width: 120,
                    child: InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const SettingsPage()),
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
                                  MaterialPageRoute(builder: (context) => const SettingsPage()),
                                );
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
                  const SizedBox(width: 40),
                  SizedBox(
                    width: 120,
                    child: InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const ChatScreen()),
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
                                  MaterialPageRoute(builder: (context) => const ChatScreen()),
                                );
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
              const SizedBox(height: 80),
            ],
          ),
        ),
      ),
    );
  }
}