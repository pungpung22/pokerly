import 'package:pokerly/core/network/api_client.dart';
import 'package:pokerly/shared/models/reward.dart';

class RewardService {
  final _dio = ApiClient().dio;

  Future<List<Reward>> getRewards() async {
    final response = await _dio.get('/rewards');
    return (response.data as List).map((e) => Reward.fromJson(e)).toList();
  }

  Future<List<Reward>> getPendingRewards() async {
    final response = await _dio.get('/rewards/pending');
    return (response.data as List).map((e) => Reward.fromJson(e)).toList();
  }

  Future<Reward> claimReward(String id) async {
    final response = await _dio.post('/rewards/$id/claim');
    return Reward.fromJson(response.data);
  }

  Future<ClaimAllResult> claimAllRewards() async {
    final response = await _dio.post('/rewards/claim-all');
    return ClaimAllResult.fromJson(response.data);
  }

  Future<Reward?> dailyLogin() async {
    final response = await _dio.post('/rewards/daily-login');
    if (response.data == null) return null;
    return Reward.fromJson(response.data);
  }

  Future<RewardStats> getStats() async {
    final response = await _dio.get('/rewards/stats');
    return RewardStats.fromJson(response.data);
  }
}

class ClaimAllResult {
  final int claimed;
  final int totalPoints;

  ClaimAllResult({
    required this.claimed,
    required this.totalPoints,
  });

  factory ClaimAllResult.fromJson(Map<String, dynamic> json) => ClaimAllResult(
    claimed: json['claimed'],
    totalPoints: json['totalPoints'],
  );
}
