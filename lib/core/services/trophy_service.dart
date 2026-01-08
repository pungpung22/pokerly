import 'package:pokerly/core/network/api_client.dart';
import 'package:pokerly/shared/models/trophy.dart';

class TrophyService {
  final _dio = ApiClient().dio;

  Future<List<Trophy>> getTrophies() async {
    final response = await _dio.get('/trophies');
    return (response.data as List).map((e) => Trophy.fromJson(e)).toList();
  }

  Future<TrophyStats> getStats() async {
    final response = await _dio.get('/trophies/stats');
    return TrophyStats.fromJson(response.data);
  }
}
