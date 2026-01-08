class Session {
  final String id;
  final DateTime date;
  final String venue;
  final String gameType;
  final String stakes;
  final int durationMinutes;
  final double buyIn;
  final double cashOut;
  final String? notes;

  Session({
    required this.id,
    required this.date,
    required this.venue,
    required this.gameType,
    required this.stakes,
    required this.durationMinutes,
    required this.buyIn,
    required this.cashOut,
    this.notes,
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

  Map<String, dynamic> toJson() => {
    'date': date.toIso8601String(),
    'venue': venue,
    'gameType': gameType,
    'stakes': stakes,
    'durationMinutes': durationMinutes,
    'buyIn': buyIn,
    'cashOut': cashOut,
    'notes': notes,
  };

  factory Session.fromJson(Map<String, dynamic> json) => Session(
    id: json['id'],
    date: DateTime.parse(json['date']),
    venue: json['venue'],
    gameType: json['gameType'],
    stakes: json['stakes'],
    durationMinutes: json['durationMinutes'],
    buyIn: (json['buyIn'] as num).toDouble(),
    cashOut: (json['cashOut'] as num).toDouble(),
    notes: json['notes'],
  );
}

class SessionStats {
  final double totalProfit;
  final int totalSessions;
  final int totalHours;
  final double todayProfit;
  final double weekProfit;
  final List<Session> recentSessions;

  SessionStats({
    required this.totalProfit,
    required this.totalSessions,
    required this.totalHours,
    required this.todayProfit,
    required this.weekProfit,
    required this.recentSessions,
  });

  factory SessionStats.fromJson(Map<String, dynamic> json) => SessionStats(
    totalProfit: (json['totalProfit'] as num).toDouble(),
    totalSessions: json['totalSessions'],
    totalHours: json['totalHours'],
    todayProfit: (json['todayProfit'] as num).toDouble(),
    weekProfit: (json['weekProfit'] as num).toDouble(),
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
    recentSessions: [],
  );
}
