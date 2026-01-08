enum RewardType {
  dailyLogin,
  sessionComplete,
  challengeComplete,
  trophyEarned,
  levelUp,
  streakBonus,
  referral,
}

class Reward {
  final String id;
  final String userId;
  final RewardType type;
  final int points;
  final String? description;
  final String? referenceId;
  final bool isClaimed;
  final DateTime? claimedAt;
  final DateTime createdAt;

  Reward({
    required this.id,
    required this.userId,
    required this.type,
    required this.points,
    this.description,
    this.referenceId,
    this.isClaimed = false,
    this.claimedAt,
    required this.createdAt,
  });

  String get typeLabel {
    switch (type) {
      case RewardType.dailyLogin:
        return '일일 로그인';
      case RewardType.sessionComplete:
        return '세션 완료';
      case RewardType.challengeComplete:
        return '챌린지 완료';
      case RewardType.trophyEarned:
        return '트로피 획득';
      case RewardType.levelUp:
        return '레벨업';
      case RewardType.streakBonus:
        return '연속 보너스';
      case RewardType.referral:
        return '추천인';
    }
  }

  String get typeIcon {
    switch (type) {
      case RewardType.dailyLogin:
        return 'login';
      case RewardType.sessionComplete:
        return 'sports_esports';
      case RewardType.challengeComplete:
        return 'emoji_events';
      case RewardType.trophyEarned:
        return 'military_tech';
      case RewardType.levelUp:
        return 'trending_up';
      case RewardType.streakBonus:
        return 'local_fire_department';
      case RewardType.referral:
        return 'person_add';
    }
  }

  factory Reward.fromJson(Map<String, dynamic> json) => Reward(
    id: json['id'],
    userId: json['userId'],
    type: RewardType.values.firstWhere(
      (e) => e.name == _snakeToCamel(json['type']),
      orElse: () => RewardType.dailyLogin,
    ),
    points: json['points'],
    description: json['description'],
    referenceId: json['referenceId'],
    isClaimed: json['isClaimed'] ?? false,
    claimedAt: json['claimedAt'] != null ? DateTime.parse(json['claimedAt']) : null,
    createdAt: DateTime.parse(json['createdAt']),
  );
}

String _snakeToCamel(String snake) {
  return snake.replaceAllMapped(
    RegExp(r'_([a-z])'),
    (match) => match.group(1)!.toUpperCase(),
  );
}

class RewardStats {
  final int totalEarned;
  final int totalClaimed;
  final int pendingPoints;
  final int pendingCount;
  final Map<String, int> byType;

  RewardStats({
    required this.totalEarned,
    required this.totalClaimed,
    required this.pendingPoints,
    required this.pendingCount,
    required this.byType,
  });

  factory RewardStats.fromJson(Map<String, dynamic> json) => RewardStats(
    totalEarned: json['totalEarned'] ?? 0,
    totalClaimed: json['totalClaimed'] ?? 0,
    pendingPoints: json['pendingPoints'] ?? 0,
    pendingCount: json['pendingCount'] ?? 0,
    byType: Map<String, int>.from(json['byType'] ?? {}),
  );

  factory RewardStats.empty() => RewardStats(
    totalEarned: 0,
    totalClaimed: 0,
    pendingPoints: 0,
    pendingCount: 0,
    byType: {},
  );
}
