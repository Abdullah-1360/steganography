
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:steganography/stegoservice.dart'; // Import your service file

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: StegoScreen(),
    );
  }
}

class StegoScreen extends StatefulWidget {
  @override
  _StegoScreenState createState() => _StegoScreenState();
}

class _StegoScreenState extends State<StegoScreen> {
  final StegoService _stegoService = StegoService();
  final _passwordController = TextEditingController();
  final _encodedTextController = TextEditingController();
  final _retrieveIdController = TextEditingController();
  final _retrievePasswordController = TextEditingController();

  String? _storedId;
  String? _retrievedText;

  Future<void> _storeData() async {
    String password = _passwordController.text;
    String encodedText = _encodedTextController.text;

    if (password.isEmpty || encodedText.isEmpty) {
      setState(() {
        _storedId = 'Error: All fields required';
      });
      return;
    }

    String? id = await _stegoService.storeData(password, encodedText);
    setState(() {
      _storedId = id ?? 'Error storing data';
    });
  }

  Future<void> _retrieveData() async {
    String id = _retrieveIdController.text;
    String password = _retrievePasswordController.text;

    if (id.isEmpty || password.isEmpty) {
      setState(() {
        _retrievedText = 'Error: All fields required';
      });
      return;
    }

    String? text = await _stegoService.retrieveData(id, password);
    setState(() {
      _retrievedText = text ?? 'Error retrieving data';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Stego Service', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
        elevation: 4,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Store Section
              Card(
                elevation: 3,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Store Data',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue,
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _passwordController,
                        decoration: InputDecoration(
                          labelText: 'Password',
                          prefixIcon: const Icon(Icons.lock),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          filled: true,
                          fillColor: Colors.grey[50],
                        ),
                        obscureText: true,
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _encodedTextController,
                        decoration: InputDecoration(
                          labelText: 'Encoded Text',
                          prefixIcon: const Icon(Icons.text_snippet),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          filled: true,
                          fillColor: Colors.grey[50],
                        ),
                        maxLines: 3,
                      ),
                      const SizedBox(height: 16),
                      Center(
                        child: ElevatedButton(
                          onPressed: _storeData,
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 20,horizontal: 40),

                          ),

                          child: const Text('Store Securely'),
                        ),
                      ),
                      const SizedBox(height: 12),
                      if (_storedId != null)
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.green[50],
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.check_circle, color: Colors.green),

                              SelectableText(
                                'Stored ID: $_storedId',
                                style: const TextStyle(color: Colors.green),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Retrieve Section
              Card(
                elevation: 3,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Retrieve Data',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue,
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _retrieveIdController,
                        decoration: InputDecoration(
                          labelText: 'Data ID',
                          prefixIcon: const Icon(Icons.numbers),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          filled: true,
                          fillColor: Colors.grey[50],
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _retrievePasswordController,
                        decoration: InputDecoration(
                          labelText: 'Password',
                          prefixIcon: const Icon(Icons.lock_outline),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          filled: true,
                          fillColor: Colors.grey[50],
                        ),
                        obscureText: true,
                      ),
                      const SizedBox(height: 16),
                      Center(
                        child: ElevatedButton(
                          onPressed: _retrieveData,
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 14,horizontal: 40),

                          ),

                          child: const Text('Retrieve Data'),
                        ),
                      ),
                      const SizedBox(height: 12),
                      if (_retrievedText != null)
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.blue[50],
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Retrieved Text:',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: Colors.blue,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(_retrievedText!),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

}



