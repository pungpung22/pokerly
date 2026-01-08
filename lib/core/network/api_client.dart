import 'package:dio/dio.dart';
import 'package:firebase_auth/firebase_auth.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;

  late final Dio dio;

  ApiClient._internal() {
    dio = Dio(BaseOptions(
      baseUrl: 'http://localhost:3002',
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
      },
    ));

    // Auth interceptor
    dio.interceptors.add(AuthInterceptor());

    dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
    ));
  }
}

class AuthInterceptor extends QueuedInterceptor {
  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final user = FirebaseAuth.instance.currentUser;
    if (user != null) {
      try {
        final token = await user.getIdToken();
        options.headers['Authorization'] = 'Bearer $token';
      } catch (e) {
        // Token refresh failed, continue without auth
      }
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      // Token might be expired, try to refresh
      final user = FirebaseAuth.instance.currentUser;
      if (user != null) {
        try {
          final token = await user.getIdToken(true); // Force refresh
          err.requestOptions.headers['Authorization'] = 'Bearer $token';

          // Retry the request
          final response = await ApiClient().dio.fetch(err.requestOptions);
          return handler.resolve(response);
        } catch (e) {
          // Refresh failed, sign out user
          await FirebaseAuth.instance.signOut();
        }
      }
    }
    handler.next(err);
  }
}
