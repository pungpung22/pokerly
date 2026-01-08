import 'package:pokerly/core/network/api_client.dart';
import 'package:pokerly/shared/models/notice.dart';

class NoticeService {
  final _dio = ApiClient().dio;

  Future<List<Notice>> getNotices() async {
    final response = await _dio.get('/notices');
    return (response.data as List).map((e) => Notice.fromJson(e)).toList();
  }

  Future<Notice> getNotice(String id) async {
    final response = await _dio.get('/notices/$id');
    return Notice.fromJson(response.data);
  }

  Future<List<Notice>> getNoticesByType(NoticeType type) async {
    final response = await _dio.get('/notices/type/${type.name}');
    return (response.data as List).map((e) => Notice.fromJson(e)).toList();
  }
}
