import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_neat_and_clean_calendar/flutter_neat_and_clean_calendar.dart';
import 'package:intl/intl.dart';

class CalendarHomePage extends StatelessWidget {
  const CalendarHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("CoHab Calendar Page"),
        centerTitle: true,
      ),
      body: const CalendarScreen(),
    );
  }
}

class CalendarScreen extends StatefulWidget {
  const CalendarScreen({super.key});

  @override
  State<StatefulWidget> createState() {
    return _CalendarScreenState();
  }
}

class _CalendarScreenState extends State<CalendarScreen> {
  late final List<NeatCleanCalendarEvent> _eventList = [];

  NeatCleanCalendarEvent? _selectedEvent;

  void _addEvent() async {
    final newEvent = await showDialog<NeatCleanCalendarEvent>(
      context: context,
      builder: (BuildContext context) {
        return const AddEventDialog();
      },
    );

    if (newEvent != null) {
      setState(() {
        _eventList.add(newEvent); // New event added here
      });
    }
  }

  void _deleteEvent(NeatCleanCalendarEvent event) {
    setState(() {
      _eventList.remove(event);
    });
  }
  void _showEventDetailsDialog(NeatCleanCalendarEvent event) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(event.summary),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Start Time: ${DateFormat.yMd().add_jm().format(event.startTime)}',
                style: const TextStyle(fontSize: 15),
              ),
              Text(
                'End Time: ${DateFormat.yMd().add_jm().format(event.endTime)}',
                style: const TextStyle(fontSize: 15),
              ),
            ],
          ),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Close'),
            ),
            TextButton(
              onPressed: () {
                _deleteEvent(event);
                Navigator.of(context).pop();
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
      body: SafeArea(
        child: Calendar(
          startOnMonday: true,
          weekDays: const ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
          eventsList: _eventList,
          isExpandable: true,
          eventDoneColor: Colors.deepPurple,
          selectedColor: Colors.blue,
          selectedTodayColor: Colors.green,
          todayColor: Colors.teal,
          eventColor: null,
          locale: 'en_US',
          todayButtonText: 'Today',
          allDayEventText: 'All Day',
          multiDayEndText: 'End',
          isExpanded: true,
          expandableDateFormat: 'EEEE, dd MMMM yyyy',
          onEventSelected: (value) {
            setState(() {
              _selectedEvent = value;
            });
            _showEventDetailsDialog(value);
          },
          onEventLongPressed: (value) {
            if (kDebugMode) {
              print('Event long pressed ${value.summary}');
            }
          },
          onDateSelected: (value) {
            setState(() {
              _selectedEvent = null;
            });
            if (kDebugMode) {
              print('Date selected $value');
            }
          },
          onRangeSelected: (value) {
            setState(() {
              _selectedEvent = null;
            });
            if (kDebugMode) {
              print('Range selected ${value.from} - ${value.to}');
            }
          },
          datePickerType: DatePickerType.date,
          dayOfWeekStyle: const TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.w800,
            fontSize: 11,
          ),
          showEvents: true,
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _addEvent,
        backgroundColor: Colors.green,
        child: const Icon(Icons.add),
      ),
    );
  }
}

class AddEventDialog extends StatefulWidget {
  const AddEventDialog({super.key});

  @override
  createState() => _AddEventDialogState();
}

class _AddEventDialogState extends State<AddEventDialog> {
  final TextEditingController _eventNameController = TextEditingController();
  DateTime _selectedDate = DateTime.now();
  TimeOfDay _selectedStartTime = TimeOfDay.now();
  TimeOfDay _selectedEndTime = TimeOfDay.now().replacing(hour: TimeOfDay.now().hour + 1);

  @override
  void dispose() {
    _eventNameController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime.now(),
      lastDate: DateTime(2101),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  Future<void> _selectStartTime(BuildContext context) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: _selectedStartTime,
    );
    if (picked != null && picked != _selectedStartTime) {
      setState(() {
        _selectedStartTime = picked;
      });
    }
  }

  Future<void> _selectEndTime(BuildContext context) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: _selectedEndTime,
    );
    if (picked != null && picked != _selectedEndTime) {
      setState(() {
        _selectedEndTime = picked;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Add Event'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(
            controller: _eventNameController,
            decoration: const InputDecoration(labelText: 'Event Name'),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Text('Date: ${DateFormat('yyyy-MM-dd').format(_selectedDate)}'),
              IconButton(
                icon: const Icon(Icons.calendar_today),
                onPressed: () => _selectDate(context),
              ),
            ],
          ),
          Row(
            children: [
              Text('Start Time: ${_selectedStartTime.format(context)}'),
              IconButton(
                icon: const Icon(Icons.access_time),
                onPressed: () => _selectStartTime(context),
              ),
            ],
          ),
          Row(
            children: [
              Text('End Time: ${_selectedEndTime.format(context)}'),
              IconButton(
                icon: const Icon(Icons.access_time),
                onPressed: () => _selectEndTime(context),
              ),
            ],
          ),
        ],
      ),
      actions: <Widget>[
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
          },
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () {
            final eventName = _eventNameController.text;
            if (eventName.isNotEmpty) {
              final startTime = DateTime(
                _selectedDate.year,
                _selectedDate.month,
                _selectedDate.day,
                _selectedStartTime.hour,
                _selectedStartTime.minute,
              );
              final endTime = DateTime(
                _selectedDate.year,
                _selectedDate.month,
                _selectedDate.day,
                _selectedEndTime.hour,
                _selectedEndTime.minute,
              );
              if (endTime.isAfter(startTime)) {
                final newEvent = NeatCleanCalendarEvent(
                  eventName,
                  description: '',
                  startTime: startTime,
                  endTime: endTime,
                  color: Colors.blue,
                );
                Navigator.of(context).pop(newEvent);
              } else {
                // Show error message that end time should be after start time
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('End time should be after start time'),
                  ),
                );
              }
            }
          },
          child: const Text('Add'),
        ),
      ],
    );
  }
}
