import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class EncodingPage extends StatefulWidget {
  @override
  _EncodingPageState createState() => _EncodingPageState();
}

class _EncodingPageState extends State<EncodingPage> {
  final TextEditingController _textController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  void _encodeText() async {
    var url = Uri.parse('http://localhost:5000/store');
    var response = await http.post(url, body: {
      'password': _passwordController.text,
      'encodedText': _textController.text,
    });
    if (response.statusCode == 201) {
      var id = response.body;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Text encoded successfully. ID: $id')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error encoding text')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Encode Text'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _textController,
              decoration: InputDecoration(labelText: 'Text to Encode'),
            ),
            TextField(
              controller: _passwordController,
              decoration: InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            ElevatedButton(
              onPressed: _encodeText,
              child: Text('Encode'),
            ),
          ],
        ),
      ),
    );
  }
}
