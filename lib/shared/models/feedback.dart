enum FeedbackType { bug, feature, improvement, other }

enum FeedbackStatus { pending, inReview, resolved, closed }

class Feedback {
  final String id;
  final String userId;
  final FeedbackType type;
  final String title;
  final String content;
  final FeedbackStatus status;
  final String? adminResponse;
  final DateTime createdAt;
  final DateTime updatedAt;

  Feedback({
    required this.id,
    required this.userId,
    required this.type,
    required this.title,
    required this.content,
    this.status = FeedbackStatus.pending,
    this.adminResponse,
    required this.createdAt,
    required this.updatedAt,
  });

  String get typeLabel {
    switch (type) {
      case FeedbackType.bug:
        return '버그 신고';
      case FeedbackType.feature:
        return '기능 요청';
      case FeedbackType.improvement:
        return '개선 제안';
      case FeedbackType.other:
        return '기타';
    }
  }

  String get statusLabel {
    switch (status) {
      case FeedbackStatus.pending:
        return '대기중';
      case FeedbackStatus.inReview:
        return '검토중';
      case FeedbackStatus.resolved:
        return '해결됨';
      case FeedbackStatus.closed:
        return '종료';
    }
  }

  factory Feedback.fromJson(Map<String, dynamic> json) => Feedback(
    id: json['id'],
    userId: json['userId'],
    type: FeedbackType.values.firstWhere(
      (e) => e.name == json['type'],
      orElse: () => FeedbackType.other,
    ),
    title: json['title'],
    content: json['content'],
    status: FeedbackStatus.values.firstWhere(
      (e) => e.name == _snakeToCamel(json['status']),
      orElse: () => FeedbackStatus.pending,
    ),
    adminResponse: json['adminResponse'],
    createdAt: DateTime.parse(json['createdAt']),
    updatedAt: DateTime.parse(json['updatedAt']),
  );

  Map<String, dynamic> toJson() => {
    'type': type.name,
    'title': title,
    'content': content,
  };
}

String _snakeToCamel(String snake) {
  return snake.replaceAllMapped(
    RegExp(r'_([a-z])'),
    (match) => match.group(1)!.toUpperCase(),
  );
}
