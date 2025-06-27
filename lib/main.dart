import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Image Classifier',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: ImageClassifier(),
    );
  }
}

class ImageClassifier extends StatefulWidget {
  @override
  _ImageClassifierState createState() => _ImageClassifierState();
}

class _ImageClassifierState extends State<ImageClassifier> {
  File? _image;
  String? _prediction;

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    setState(() {
      if (pickedFile != null) {
        _image = File(pickedFile.path);
      }
    });
  }

  Future<void> _predictImage() async {
    if (_image == null) return;

    final request = http.MultipartRequest(
      'POST',
      Uri.parse('http://steganography-psi.vercel.app/predict'),
    );
    request.files.add(
      http.MultipartFile.fromBytes(
        'image',
        await _image!.readAsBytes(),
        filename: _image!.path.split('/').last,
      ),
    );

    final response = await request.send();
    final responseData = await response.stream.bytesToString();
    final prediction = json.decode(responseData)['predictedClass'];

    setState(() {
      _prediction = prediction;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Image Classifier')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            _image == null
                ? Text('No image selected.')
                : Container(
                  width: 200,
                  height: 200,
                  child: Image.file(_image!),
                ),
            SizedBox(height: 20),
            ElevatedButton(onPressed: _pickImage, child: Text('Pick Image')),
            ElevatedButton(onPressed: _predictImage, child: Text('Predict')),
            if (_prediction != null) Text('Prediction: $_prediction'),
          ],
        ),
      ),
    );
  }
}
