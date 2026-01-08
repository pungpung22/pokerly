enum TrophyType {
  firstSession,
  winningStreak,
  profitMilestone,
  sessionsMilestone,
  hoursMilestone,
  challengeComplete,
  monthlyChampion,
}

enum TrophyRarity { common, rare, epic, legendary }

class Trophy {
  final String id;
  final String userId;
  final TrophyType type;
  final String title;
  final String description;
  final String icon;
  final TrophyRarity rarity;
  final int rewardPoints;
  final DateTime earnedAt;
  final DateTime createdAt;

  Trophy({
    required this.id,
    required this.userId,
    required this.type,
    required this.title,
    required this.description,
    required this.icon,
    required this.rarity,
    required this.rewardPoints,
    required this.earnedAt,
    required this.createdAt,
  });

  String get rarityColor {
    switch (rarity) {
      case TrophyRarity.common:
        return '#9CA3AF'; // Gray
      case TrophyRarity.rare:
        return '#3B82F6'; // Blue
      case TrophyRarity.epic:
        return '#8B5CF6'; // Purple
      case TrophyRarity.legendary:
        return '#F59E0B'; // Gold
    }
  }

  factory Trophy.fromJson(Map<String, dynamic> json) => Trophy(
    id: json['id'],
    userId: json['userId'],
    type: TrophyType.values.firstWhere(
      (e) => e.name == _snakeToCamel(json['type']),
      orElse: () => TrophyType.firstSession,
    ),
    title: json['title'],
    description: json['description'],
    icon: json['icon'],
    rarity: TrophyRarity.values.firstWhere(
      (e) => e.name == json['rarity'],
      orElse: () => TrophyRarity.common,
    ),
    rewardPoints: json['rewardPoints'] ?? 0,
    earnedAt: DateTime.parse(json['earnedAt']),
    createdAt: DateTime.parse(json['createdAt']),
  );
}

String _snakeToCamel(String snake) {
  return snake.replaceAllMapped(
    RegExp(r'_([a-z])'),
    (match) => match.group(1)!.toUpperCase(),
  );
}

class TrophyStats {
  final int total;
  final Map<String, int> byRarity;
  final int totalPointsEarned;

  TrophyStats({
    required this.total,
    required this.byRarity,
    required this.totalPointsEarned,
  });

  factory TrophyStats.fromJson(Map<String, dynamic> json) => TrophyStats(
    total: json['total'] ?? 0,
    byRarity: Map<String, int>.from(json['byRarity'] ?? {}),
    totalPointsEarned: json['totalPointsEarned'] ?? 0,
  );

  factory TrophyStats.empty() => TrophyStats(
    total: 0,
    byRarity: {},
    totalPointsEarned: 0,
  );
}
