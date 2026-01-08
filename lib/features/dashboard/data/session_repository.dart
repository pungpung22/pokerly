import 'package:dio/dio.dart';
import '../../../core/network/api_client.dart';
import '../../../shared/models/session.dart';

class SessionRepository {
  final Dio _dio = ApiClient().dio;

  Future<List<Session>> getAllSessions() async {
    try {
      final response = await _dio.get('/sessions');
      return (response.data as List)
          .map((e) => Session.fromJson(e))
          .toList();
    } catch (e) {
      print('Error fetching sessions: $e');
      return [];
    }
  }

  Future<SessionStats> getStats() async {
    try {
      final response = await _dio.get('/sessions/stats');
      return SessionStats.fromJson(response.data);
    } catch (e) {
      print('Error fetching stats: $e');
      return SessionStats.empty();
    }
  }

  Future<List<double>> getWeeklyData() async {
    try {
      final response = await _dio.get('/sessions/weekly');
      return (response.data['dailyProfits'] as List)
          .map((e) => (e as num).toDouble())
          .toList();
    } catch (e) {
      print('Error fetching weekly data: $e');
      return List.filled(7, 0.0);
    }
  }

  Future<Session?> createSession(Session session) async {
    try {
      final response = await _dio.post('/sessions', data: session.toJson());
      return Session.fromJson(response.data);
    } catch (e) {
      print('Error creating session: $e');
      return null;
    }
  }

  Future<Session?> createSessionFromData(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('/sessions', data: data);
      return Session.fromJson(response.data);
    } catch (e) {
      print('Error creating session: $e');
      return null;
    }
  }

  Future<bool> deleteSession(String id) async {
    try {
      await _dio.delete('/sessions/$id');
      return true;
    } catch (e) {
      print('Error deleting session: $e');
      return false;
    }
  }
}
