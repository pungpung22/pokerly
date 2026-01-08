import 'package:pokerly/core/network/api_client.dart';
import 'package:pokerly/shared/models/challenge.dart';

class ChallengeService {
  final _dio = ApiClient().dio;

  Future<List<Challenge>> getChallenges() async {
    final response = await _dio.get('/challenges');
    return (response.data as List).map((e) => Challenge.fromJson(e)).toList();
  }

  Future<List<Challenge>> getActiveChallenges() async {
    final response = await _dio.get('/challenges/active');
    return (response.data as List).map((e) => Challenge.fromJson(e)).toList();
  }

  Future<Challenge> getChallenge(String id) async {
    final response = await _dio.get('/challenges/$id');
    return Challenge.fromJson(response.data);
  }

  Future<Challenge> createChallenge(Map<String, dynamic> data) async {
    final response = await _dio.post('/challenges', data: data);
    return Challenge.fromJson(response.data);
  }

  Future<Challenge> updateChallenge(String id, Map<String, dynamic> data) async {
    final response = await _dio.patch('/challenges/$id', data: data);
    return Challenge.fromJson(response.data);
  }

  Future<Challenge> updateProgress(String id, int increment) async {
    final response = await _dio.patch('/challenges/$id/progress', data: {'increment': increment});
    return Challenge.fromJson(response.data);
  }

  Future<void> deleteChallenge(String id) async {
    await _dio.delete('/challenges/$id');
  }

  Future<ChallengeStats> getStats() async {
    final response = await _dio.get('/challenges/stats');
    return ChallengeStats.fromJson(response.data);
  }

  Future<int> checkExpired() async {
    final response = await _dio.post('/challenges/check-expired');
    return response.data as int;
  }
}
