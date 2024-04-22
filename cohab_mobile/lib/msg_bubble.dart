import 'package:flutter/material.dart';

class MsgBubble extends StatelessWidget {
  final String firstName;
  final String msg;
  final String time;
  final bool isCurrentUser;
  final VoidCallback? onDelete;

  const MsgBubble({
    Key? key,
    required this.msg,
    required this.firstName,
    required this.time,
    required this.isCurrentUser,
    this.onDelete,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Column(
        crossAxisAlignment: isCurrentUser ? CrossAxisAlignment.end : CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: isCurrentUser ? MainAxisAlignment.end : MainAxisAlignment.start,
            children: [
              if (isCurrentUser)
                Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: GestureDetector(
                    onTap: onDelete,
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Icon(Icons.delete_outline, size: 20, color: Colors.grey[600]), 
                    ),
                  ),
                ),
              if (!isCurrentUser)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 15),
                  child: Text(
                    firstName,
                    style: const TextStyle(
                      color: Color(0xFF3582F6),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
            ],
          ),
          Align(
            alignment: isCurrentUser ? Alignment.centerRight : Alignment.centerLeft,
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 10),
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: isCurrentUser ? const Color(0xFF005A44) : const Color(0xFF00435A),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    msg,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    time,
                    style: const TextStyle(
                      color: Color(0xFFD3D3D3),
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}