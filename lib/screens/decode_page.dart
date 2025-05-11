
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class DecodingPage extends StatefulWidget {
  @override
  _DecodingPageState createState() => _DecodingPageState();
}

class _DecodingPageState extends State<DecodingPage> {
  final TextEditingController _idController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  String _decodedText = '';

  void _decodeText() async {
    var url = Uri.parse('http://localhost:5000/retrieve');
    var response = await http.post(url, body: {
      'id': _idController.text,
      'password': _passwordController.text,
    });
    if (response.statusCode == 200) {
      var data = response.body;
      setState(() {
        _decodedText = data;
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error decoding text')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Decode Text'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _idController,
              decoration: InputDecoration(labelText: 'ID'),
            ),
            TextField(
              controller: _passwordController,
              decoration: InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            ElevatedButton(
              onPressed: _decodeText,
              child: Text('Decode'),
            ),
            Text(_decodedText),
          ],
        ),
      ),
    );
  }
}