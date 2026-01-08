import 'package:hive/hive.dart';

part 'user_stats.g.dart';

@HiveType(typeId: 3)
class UserStats extends HiveObject {
  @HiveField(0)
  String oddsName;

  @HiveField(1)
  int level;

  @HiveField(2)
  int totalPoints;

  @HiveField(3)
  int pendingPoints;

  @HiveField(4)
  int monthlyPoints;

  @HiveField(5)
  int totalSessions;

  @HiveField(6)
  int totalMinutesPlayed;

  @HiveField(7)
  double totalProfit;

  @HiveField(8)
  int challengesCompleted;

  UserStats({
    this.userName = 'Player',
    this.level = 1,
    this.totalPoints = 0,
    this.pendingPoints = 0,
    this.monthlyPoints = 0,
    this.totalSessions = 0,
    this.totalMinutesPlayed = 0,
    this.totalProfit = 0,
    this.challengesCompleted = 0,
  });

  String get userName => oddsName;
  set userName(String value) => oddsName = value;

  int get totalHoursPlayed => totalMinutesPlayed ~/ 60;

  String get profitFormatted {
    final sign = totalProfit >= 0 ? '+' : '';
    return '$sign\$${totalProfit.toStringAsFixed(0)}';
  }
}
