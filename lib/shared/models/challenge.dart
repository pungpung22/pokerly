enum ChallengeType { sessions, profit, hours, streak, venue }

enum ChallengeStatus { active, completed, failed, expired }

class Challenge {
  final String id;
  final String userId;
  final String title;
  final String description;
  final ChallengeType type;
  final int targetValue;
  final int currentValue;
  final int rewardPoints;
  final DateTime startDate;
  final DateTime endDate;
  final ChallengeStatus status;
  final DateTime createdAt;
  final DateTime updatedAt;

  Challenge({
    required this.id,
    required this.userId,
    required this.title,
    required this.description,
    required this.type,
    required this.targetValue,
    this.currentValue = 0,
    required this.rewardPoints,
    required this.startDate,
    required this.endDate,
    this.status = ChallengeStatus.active,
    required this.createdAt,
    required this.updatedAt,
  });

  double get progress => (currentValue / targetValue).clamp(0.0, 1.0);
  int get progressPercent => (progress * 100).round();
  bool get isCompleted => status == ChallengeStatus.completed;
  bool get isExpired => DateTime.now().isAfter(endDate) && status == ChallengeStatus.active;
  int get daysLeft => endDate.difference(DateTime.now()).inDays.clamp(0, 999);

  String get typeIcon {
    switch (type) {
      case ChallengeType.sessions:
        return 'sports_esports';
      case ChallengeType.profit:
        return 'payments';
      case ChallengeType.hours:
        return 'schedule';
      case ChallengeType.streak:
        return 'local_fire_department';
      case ChallengeType.venue:
        return 'place';
    }
  }

  factory Challenge.fromJson(Map<String, dynamic> json) => Challenge(
    id: json['id'],
    userId: json['userId'],
    title: json['title'],
    description: json['description'],
    type: ChallengeType.values.firstWhere(
      (e) => e.name == json['type'],
      orElse: () => ChallengeType.sessions,
    ),
    targetValue: json['targetValue'],
    currentValue: json['currentValue'] ?? 0,
    rewardPoints: json['rewardPoints'],
    startDate: DateTime.parse(json['startDate']),
    endDate: DateTime.parse(json['endDate']),
    status: ChallengeStatus.values.firstWhere(
      (e) => e.name == json['status'],
      orElse: () => ChallengeStatus.active,
    ),
    createdAt: DateTime.parse(json['createdAt']),
    updatedAt: DateTime.parse(json['updatedAt']),
  );

  Map<String, dynamic> toJson() => {
    'title': title,
    'description': description,
    'type': type.name,
    'targetValue': targetValue,
    'currentValue': currentValue,
    'rewardPoints': rewardPoints,
    'startDate': startDate.toIso8601String(),
    'endDate': endDate.toIso8601String(),
  };
}

class ChallengeStats {
  final int total;
  final int active;
  final int completed;
  final int failed;
  final int expired;
  final int completionRate;
  final int totalRewardsEarned;

  ChallengeStats({
    required this.total,
    required this.active,
    required this.completed,
    required this.failed,
    required this.expired,
    required this.completionRate,
    required this.totalRewardsEarned,
  });

  factory ChallengeStats.fromJson(Map<String, dynamic> json) => ChallengeStats(
    total: json['total'] ?? 0,
    active: json['active'] ?? 0,
    completed: json['completed'] ?? 0,
    failed: json['failed'] ?? 0,
    expired: json['expired'] ?? 0,
    completionRate: json['completionRate'] ?? 0,
    totalRewardsEarned: json['totalRewardsEarned'] ?? 0,
  );

  factory ChallengeStats.empty() => ChallengeStats(
    total: 0,
    active: 0,
    completed: 0,
    failed: 0,
    expired: 0,
    completionRate: 0,
    totalRewardsEarned: 0,
  );
}
