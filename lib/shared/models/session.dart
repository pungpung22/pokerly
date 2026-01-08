enum GameType { cash, tournament }

class Session {
  final String id;
  final String userId;
  final DateTime date;
  final String venue;
  final GameType gameType;
  final String stakes;
  final int durationMinutes;
  final double buyIn;
  final double cashOut;
  final String? notes;
  final String? screenshotUrl;
  final DateTime createdAt;
  final DateTime updatedAt;

  Session({
    required this.id,
    required this.userId,
    required this.date,
    required this.venue,
    required this.gameType,
    required this.stakes,
    required this.durationMinutes,
    required this.buyIn,
    required this.cashOut,
    this.notes,
    this.screenshotUrl,
    required this.createdAt,
    required this.updatedAt,
  });

  double get profit => cashOut - buyIn;
  bool get isProfit => profit >= 0;

  String get durationFormatted {
    final hours = durationMinutes ~/ 60;
    final mins = durationMinutes % 60;
    if (hours > 0) return '${hours}h ${mins}m';
    return '${mins}m';
  }

  String get profitFormatted {
    final sign = isProfit ? '+' : '';
    return '$sign\$${profit.toStringAsFixed(0)}';
  }

  String get gameTypeLabel => gameType == GameType.cash ? 'Cash Game' : 'Tournament';

  Map<String, dynamic> toJson() => {
    'date': date.toIso8601String(),
    'venue': venue,
    'gameType': gameType.name,
    'stakes': stakes,
    'durationMinutes': durationMinutes,
    'buyIn': buyIn,
    'cashOut': cashOut,
    'notes': notes,
    'screenshotUrl': screenshotUrl,
  };

  factory Session.fromJson(Map<String, dynamic> json) => Session(
    id: json['id'],
    userId: json['userId'],
    date: DateTime.parse(json['date']),
    venue: json['venue'],
    gameType: GameType.values.firstWhere(
      (e) => e.name == json['gameType'],
      orElse: () => GameType.cash,
    ),
    stakes: json['stakes'],
    durationMinutes: json['durationMinutes'],
    buyIn: (json['buyIn'] as num).toDouble(),
    cashOut: (json['cashOut'] as num).toDouble(),
    notes: json['notes'],
    screenshotUrl: json['screenshotUrl'],
    createdAt: DateTime.parse(json['createdAt']),
    updatedAt: DateTime.parse(json['updatedAt']),
  );
}

class SessionStats {
  final double totalProfit;
  final int totalSessions;
  final int totalHours;
  final double todayProfit;
  final double weekProfit;
  final double monthProfit;
  final double winRate;
  final List<Session> recentSessions;

  SessionStats({
    required this.totalProfit,
    required this.totalSessions,
    required this.totalHours,
    required this.todayProfit,
    required this.weekProfit,
    required this.monthProfit,
    required this.winRate,
    required this.recentSessions,
  });

  factory SessionStats.fromJson(Map<String, dynamic> json) => SessionStats(
    totalProfit: (json['totalProfit'] as num).toDouble(),
    totalSessions: json['totalSessions'],
    totalHours: json['totalHours'],
    todayProfit: (json['todayProfit'] as num).toDouble(),
    weekProfit: (json['weekProfit'] as num).toDouble(),
    monthProfit: (json['monthProfit'] as num?)?.toDouble() ?? 0.0,
    winRate: (json['winRate'] as num?)?.toDouble() ?? 0.0,
    recentSessions: (json['recentSessions'] as List)
        .map((e) => Session.fromJson(e))
        .toList(),
  );

  factory SessionStats.empty() => SessionStats(
    totalProfit: 0,
    totalSessions: 0,
    totalHours: 0,
    todayProfit: 0,
    weekProfit: 0,
    monthProfit: 0,
    winRate: 0,
    recentSessions: [],
  );
}

class WeeklyData {
  final List<double> dailyProfits;
  final List<String> labels;

  WeeklyData({
    required this.dailyProfits,
    required this.labels,
  });

  factory WeeklyData.fromJson(Map<String, dynamic> json) => WeeklyData(
    dailyProfits: (json['dailyProfits'] as List).map((e) => (e as num).toDouble()).toList(),
    labels: (json['labels'] as List).map((e) => e as String).toList(),
  );

  factory WeeklyData.empty() => WeeklyData(
    dailyProfits: List.filled(7, 0.0),
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  );
}

class MonthlyData {
  final int year;
  final int month;
  final List<double> dailyProfits;
  final double totalProfit;
  final int totalSessions;

  MonthlyData({
    required this.year,
    required this.month,
    required this.dailyProfits,
    required this.totalProfit,
    required this.totalSessions,
  });

  factory MonthlyData.fromJson(Map<String, dynamic> json) => MonthlyData(
    year: json['year'],
    month: json['month'],
    dailyProfits: (json['dailyProfits'] as List).map((e) => (e as num).toDouble()).toList(),
    totalProfit: (json['totalProfit'] as num).toDouble(),
    totalSessions: json['totalSessions'],
  );
}

class AnalyticsData {
  final Map<String, VenueStats> byVenue;
  final Map<String, StakesStats> byStakes;
  final Map<String, GameTypeStats> byGameType;
  final StreakData streaks;
  final TotalsData totals;

  AnalyticsData({
    required this.byVenue,
    required this.byStakes,
    required this.byGameType,
    required this.streaks,
    required this.totals,
  });

  factory AnalyticsData.fromJson(Map<String, dynamic> json) => AnalyticsData(
    byVenue: (json['byVenue'] as Map<String, dynamic>).map(
      (k, v) => MapEntry(k, VenueStats.fromJson(v)),
    ),
    byStakes: (json['byStakes'] as Map<String, dynamic>).map(
      (k, v) => MapEntry(k, StakesStats.fromJson(v)),
    ),
    byGameType: (json['byGameType'] as Map<String, dynamic>).map(
      (k, v) => MapEntry(k, GameTypeStats.fromJson(v)),
    ),
    streaks: StreakData.fromJson(json['streaks']),
    totals: TotalsData.fromJson(json['totals']),
  );

  factory AnalyticsData.empty() => AnalyticsData(
    byVenue: {},
    byStakes: {},
    byGameType: {},
    streaks: StreakData(current: 0, max: 0),
    totals: TotalsData(sessions: 0, profit: 0, hours: 0),
  );
}

class VenueStats {
  final int sessions;
  final double profit;
  final double hours;

  VenueStats({
    required this.sessions,
    required this.profit,
    required this.hours,
  });

  factory VenueStats.fromJson(Map<String, dynamic> json) => VenueStats(
    sessions: json['sessions'],
    profit: (json['profit'] as num).toDouble(),
    hours: (json['hours'] as num).toDouble(),
  );
}

class StakesStats {
  final int sessions;
  final double profit;

  StakesStats({
    required this.sessions,
    required this.profit,
  });

  factory StakesStats.fromJson(Map<String, dynamic> json) => StakesStats(
    sessions: json['sessions'],
    profit: (json['profit'] as num).toDouble(),
  );
}

class GameTypeStats {
  final int sessions;
  final double profit;

  GameTypeStats({
    required this.sessions,
    required this.profit,
  });

  factory GameTypeStats.fromJson(Map<String, dynamic> json) => GameTypeStats(
    sessions: json['sessions'],
    profit: (json['profit'] as num).toDouble(),
  );
}

class StreakData {
  final int current;
  final int max;

  StreakData({
    required this.current,
    required this.max,
  });

  factory StreakData.fromJson(Map<String, dynamic> json) => StreakData(
    current: json['current'],
    max: json['max'],
  );
}

class TotalsData {
  final int sessions;
  final double profit;
  final double hours;

  TotalsData({
    required this.sessions,
    required this.profit,
    required this.hours,
  });

  factory TotalsData.fromJson(Map<String, dynamic> json) => TotalsData(
    sessions: json['sessions'],
    profit: (json['profit'] as num).toDouble(),
    hours: (json['hours'] as num).toDouble(),
  );
}
