import 'dart:convert';
import 'package:http/http.dart' as http;

const String apiUrl = 'https://steganography-psi.vercel.app'; // Replace with your backend URL

class StegoService {
  // Store data on the server
  Future<String?> storeData(String password, String encodedText) async {
    var url = Uri.parse('$apiUrl/store');
    Map<String, String> headers = {'Content-Type': 'application/json'};
    var body = jsonEncode({
      'password': password,
      'encodedText': encodedText,
    });

    try {
      var response = await http.post(url, headers: headers, body: body);

      if (response.statusCode == 201) {
        Map<String, dynamic> data = jsonDecode(response.body);
        return data['id'];
      } else if (response.statusCode == 400) {
        print('Error: Missing required fields');
      } else {
        print('Error storing data: ${response.statusCode}');
      }
      return null;
    } catch (e) {
      print('Exception storing data: $e');
      return null;
    }
  }

  // Retrieve data from the server
  Future<String?> retrieveData(String id, String password) async {
    var url = Uri.parse('$apiUrl/retrieve');
    Map<String, String> headers = {'Content-Type': 'application/json'};
    var body = jsonEncode({
      'id': id,
      'password': password,
    });

    try {
      var response = await http.post(url, headers: headers, body: body);

      if (response.statusCode == 200) {
        Map<String, dynamic> data = jsonDecode(response.body);
        return data['encodedText'];
      } else if (response.statusCode == 400) {
        print('Error: Missing required fields');
      } else if (response.statusCode == 401) {
        print('Error: Incorrect password');
      } else if (response.statusCode == 404) {
        print('Error: Data not found');
      } else {
        print('Error retrieving data: ${response.statusCode}');
      }
      return null;
    } catch (e) {
      print('Exception retrieving data: $e');
      return null;
    }
  }
}