import 'package:hive/hive.dart';

part 'challenge.g.dart';

@HiveType(typeId: 1)
class Challenge extends HiveObject {
  @HiveField(0)
  String id;

  @HiveField(1)
  String title;

  @HiveField(2)
  String description;

  @HiveField(3)
  ChallengeType type;

  @HiveField(4)
  int targetValue;

  @HiveField(5)
  int currentValue;

  @HiveField(6)
  int rewardPoints;

  @HiveField(7)
  DateTime startDate;

  @HiveField(8)
  DateTime endDate;

  @HiveField(9)
  bool isCompleted;

  Challenge({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.targetValue,
    this.currentValue = 0,
    required this.rewardPoints,
    required this.startDate,
    required this.endDate,
    this.isCompleted = false,
  });

  double get progress => (currentValue / targetValue).clamp(0.0, 1.0);
  bool get isExpired => DateTime.now().isAfter(endDate);
  int get daysLeft => endDate.difference(DateTime.now()).inDays;
}

@HiveType(typeId: 2)
enum ChallengeType {
  @HiveField(0)
  sessions, // Play X sessions

  @HiveField(1)
  profit, // Earn X profit

  @HiveField(2)
  hours, // Play X hours

  @HiveField(3)
  streak, // X day streak

  @HiveField(4)
  venue, // Play at specific venue
}
