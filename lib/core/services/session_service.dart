import 'package:pokerly/core/network/api_client.dart';
import 'package:pokerly/shared/models/session.dart';

class SessionService {
  final _dio = ApiClient().dio;

  Future<List<Session>> getSessions({int? limit}) async {
    final response = await _dio.get(
      '/sessions',
      queryParameters: limit != null ? {'limit': limit} : null,
    );
    return (response.data as List).map((e) => Session.fromJson(e)).toList();
  }

  Future<Session> getSession(String id) async {
    final response = await _dio.get('/sessions/$id');
    return Session.fromJson(response.data);
  }

  Future<Session> createSession(Map<String, dynamic> data) async {
    final response = await _dio.post('/sessions', data: data);
    return Session.fromJson(response.data);
  }

  Future<Session> updateSession(String id, Map<String, dynamic> data) async {
    final response = await _dio.patch('/sessions/$id', data: data);
    return Session.fromJson(response.data);
  }

  Future<void> deleteSession(String id) async {
    await _dio.delete('/sessions/$id');
  }

  Future<SessionStats> getStats() async {
    final response = await _dio.get('/sessions/stats');
    return SessionStats.fromJson(response.data);
  }

  Future<WeeklyData> getWeeklyData() async {
    final response = await _dio.get('/sessions/weekly');
    return WeeklyData.fromJson(response.data);
  }

  Future<MonthlyData> getMonthlyData({int? year, int? month}) async {
    final now = DateTime.now();
    final response = await _dio.get(
      '/sessions/monthly',
      queryParameters: {
        'year': year ?? now.year,
        'month': month ?? now.month,
      },
    );
    return MonthlyData.fromJson(response.data);
  }

  Future<AnalyticsData> getAnalytics() async {
    final response = await _dio.get('/sessions/analytics');
    return AnalyticsData.fromJson(response.data);
  }
}
