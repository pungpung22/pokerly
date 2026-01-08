enum AuthProvider { google, apple, email }

class User {
  final String id;
  final String firebaseUid;
  final String email;
  final String? displayName;
  final String? photoUrl;
  final AuthProvider provider;
  final int level;
  final int totalPoints;
  final int pendingPoints;
  final int monthlyPoints;
  final String locale;
  final String theme;
  final bool notificationsEnabled;
  final DateTime createdAt;
  final DateTime updatedAt;

  User({
    required this.id,
    required this.firebaseUid,
    required this.email,
    this.displayName,
    this.photoUrl,
    this.provider = AuthProvider.google,
    this.level = 1,
    this.totalPoints = 0,
    this.pendingPoints = 0,
    this.monthlyPoints = 0,
    this.locale = 'ko',
    this.theme = 'dark',
    this.notificationsEnabled = true,
    required this.createdAt,
    required this.updatedAt,
  });

  String get name => displayName ?? email.split('@').first;

  int get pointsToNextLevel => ((level) * 1000) - totalPoints;

  double get levelProgress {
    final currentLevelPoints = (level - 1) * 1000;
    final nextLevelPoints = level * 1000;
    return (totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints);
  }

  factory User.fromJson(Map<String, dynamic> json) => User(
    id: json['id'],
    firebaseUid: json['firebaseUid'],
    email: json['email'],
    displayName: json['displayName'],
    photoUrl: json['photoUrl'],
    provider: AuthProvider.values.firstWhere(
      (e) => e.name == json['provider'],
      orElse: () => AuthProvider.google,
    ),
    level: json['level'] ?? 1,
    totalPoints: json['totalPoints'] ?? 0,
    pendingPoints: json['pendingPoints'] ?? 0,
    monthlyPoints: json['monthlyPoints'] ?? 0,
    locale: json['locale'] ?? 'ko',
    theme: json['theme'] ?? 'dark',
    notificationsEnabled: json['notificationsEnabled'] ?? true,
    createdAt: DateTime.parse(json['createdAt']),
    updatedAt: DateTime.parse(json['updatedAt']),
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'firebaseUid': firebaseUid,
    'email': email,
    'displayName': displayName,
    'photoUrl': photoUrl,
    'provider': provider.name,
    'level': level,
    'totalPoints': totalPoints,
    'pendingPoints': pendingPoints,
    'monthlyPoints': monthlyPoints,
    'locale': locale,
    'theme': theme,
    'notificationsEnabled': notificationsEnabled,
  };

  User copyWith({
    String? displayName,
    String? photoUrl,
    int? level,
    int? totalPoints,
    int? pendingPoints,
    int? monthlyPoints,
    String? locale,
    String? theme,
    bool? notificationsEnabled,
  }) {
    return User(
      id: id,
      firebaseUid: firebaseUid,
      email: email,
      displayName: displayName ?? this.displayName,
      photoUrl: photoUrl ?? this.photoUrl,
      provider: provider,
      level: level ?? this.level,
      totalPoints: totalPoints ?? this.totalPoints,
      pendingPoints: pendingPoints ?? this.pendingPoints,
      monthlyPoints: monthlyPoints ?? this.monthlyPoints,
      locale: locale ?? this.locale,
      theme: theme ?? this.theme,
      notificationsEnabled: notificationsEnabled ?? this.notificationsEnabled,
      createdAt: createdAt,
      updatedAt: DateTime.now(),
    );
  }
}

class UserProfile {
  final User user;
  final UserStats stats;

  UserProfile({
    required this.user,
    required this.stats,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
    user: User.fromJson(json['user']),
    stats: UserStats.fromJson(json['stats']),
  );
}

class UserStats {
  final int totalSessions;
  final double totalProfit;
  final int totalHours;
  final double winRate;

  UserStats({
    required this.totalSessions,
    required this.totalProfit,
    required this.totalHours,
    required this.winRate,
  });

  factory UserStats.fromJson(Map<String, dynamic> json) => UserStats(
    totalSessions: json['totalSessions'] ?? 0,
    totalProfit: (json['totalProfit'] as num?)?.toDouble() ?? 0.0,
    totalHours: json['totalHours'] ?? 0,
    winRate: (json['winRate'] as num?)?.toDouble() ?? 0.0,
  );

  factory UserStats.empty() => UserStats(
    totalSessions: 0,
    totalProfit: 0,
    totalHours: 0,
    winRate: 0,
  );
}
