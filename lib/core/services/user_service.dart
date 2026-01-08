import 'package:pokerly/core/network/api_client.dart';
import 'package:pokerly/shared/models/user.dart';

class UserService {
  final _dio = ApiClient().dio;

  Future<UserProfile> getProfile() async {
    final response = await _dio.get('/users/me');
    return UserProfile.fromJson(response.data);
  }

  Future<User> updateProfile(Map<String, dynamic> data) async {
    final response = await _dio.patch('/users/me', data: data);
    return User.fromJson(response.data);
  }

  Future<User> claimPoints() async {
    final response = await _dio.post('/users/me/claim-points');
    return User.fromJson(response.data);
  }
}
