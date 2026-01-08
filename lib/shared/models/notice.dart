enum NoticeType { announcement, update, event, maintenance }

class Notice {
  final String id;
  final String title;
  final String content;
  final NoticeType type;
  final bool isImportant;
  final bool isActive;
  final DateTime? publishedAt;
  final DateTime? expiresAt;
  final DateTime createdAt;
  final DateTime updatedAt;

  Notice({
    required this.id,
    required this.title,
    required this.content,
    required this.type,
    this.isImportant = false,
    this.isActive = true,
    this.publishedAt,
    this.expiresAt,
    required this.createdAt,
    required this.updatedAt,
  });

  String get typeIcon {
    switch (type) {
      case NoticeType.announcement:
        return 'campaign';
      case NoticeType.update:
        return 'system_update';
      case NoticeType.event:
        return 'celebration';
      case NoticeType.maintenance:
        return 'build';
    }
  }

  String get typeLabel {
    switch (type) {
      case NoticeType.announcement:
        return '공지';
      case NoticeType.update:
        return '업데이트';
      case NoticeType.event:
        return '이벤트';
      case NoticeType.maintenance:
        return '점검';
    }
  }

  factory Notice.fromJson(Map<String, dynamic> json) => Notice(
    id: json['id'],
    title: json['title'],
    content: json['content'],
    type: NoticeType.values.firstWhere(
      (e) => e.name == json['type'],
      orElse: () => NoticeType.announcement,
    ),
    isImportant: json['isImportant'] ?? false,
    isActive: json['isActive'] ?? true,
    publishedAt: json['publishedAt'] != null ? DateTime.parse(json['publishedAt']) : null,
    expiresAt: json['expiresAt'] != null ? DateTime.parse(json['expiresAt']) : null,
    createdAt: DateTime.parse(json['createdAt']),
    updatedAt: DateTime.parse(json['updatedAt']),
  );
}
