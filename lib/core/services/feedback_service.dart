import 'package:pokerly/core/network/api_client.dart';
import 'package:pokerly/shared/models/feedback.dart';

class FeedbackService {
  final _dio = ApiClient().dio;

  Future<List<Feedback>> getFeedbacks() async {
    final response = await _dio.get('/feedbacks');
    return (response.data as List).map((e) => Feedback.fromJson(e)).toList();
  }

  Future<Feedback> getFeedback(String id) async {
    final response = await _dio.get('/feedbacks/$id');
    return Feedback.fromJson(response.data);
  }

  Future<Feedback> createFeedback(Map<String, dynamic> data) async {
    final response = await _dio.post('/feedbacks', data: data);
    return Feedback.fromJson(response.data);
  }

  Future<void> deleteFeedback(String id) async {
    await _dio.delete('/feedbacks/$id');
  }
}
