import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class ActiveChallenges extends StatelessWidget {
  final List<ChallengeData> challenges;

  const ActiveChallenges({
    super.key,
    this.challenges = const [],
  });

  static final List<ChallengeData> sampleChallenges = [
    ChallengeData(
      title: 'Weekly Grinder',
      description: 'Play 50 games this week',
      current: 32,
      total: 50,
      reward: 5000,
      icon: Icons.local_fire_department,
      color: const Color(0xFFFF6B6B),
      expiresIn: '3 days',
    ),
    ChallengeData(
      title: 'Profit Master',
      description: 'Earn ₩100,000 total profit',
      current: 78500,
      total: 100000,
      reward: 10000,
      icon: Icons.trending_up,
      color: AppColors.profit,
      expiresIn: '5 days',
    ),
    ChallengeData(
      title: 'Tournament King',
      description: 'Win 5 tournaments',
      current: 2,
      total: 5,
      reward: 15000,
      icon: Icons.emoji_events,
      color: const Color(0xFFFFD700),
      expiresIn: '7 days',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final displayChallenges = challenges.isEmpty ? sampleChallenges : challenges;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Active Challenges',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.profit.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                '${displayChallenges.length} Active',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppColors.profit,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        ...displayChallenges.map((challenge) => Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: _ChallengeCard(challenge: challenge),
        )),
      ],
    );
  }
}

class _ChallengeCard extends StatelessWidget {
  final ChallengeData challenge;

  const _ChallengeCard({required this.challenge});

  @override
  Widget build(BuildContext context) {
    final progress = challenge.total > 0 ? challenge.current / challenge.total : 0.0;
    final percentage = (progress * 100).toInt();

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: challenge.color.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(challenge.icon, color: challenge.color, size: 22),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      challenge.title,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      challenge.description,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.card_giftcard, size: 14, color: AppColors.promotion),
                      const SizedBox(width: 4),
                      Text(
                        '₩${_formatNumber(challenge.reward)}',
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.promotion,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.schedule, size: 12, color: AppColors.textMuted),
                      const SizedBox(width: 4),
                      Text(
                        challenge.expiresIn,
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: progress.clamp(0.0, 1.0),
                    backgroundColor: AppColors.border,
                    valueColor: AlwaysStoppedAnimation<Color>(challenge.color),
                    minHeight: 6,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Text(
                '$percentage%',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: challenge.color,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _formatNumber(int number) {
    if (number >= 1000) {
      return '${(number / 1000).toStringAsFixed(number % 1000 == 0 ? 0 : 1)}K';
    }
    return number.toString();
  }
}

class ChallengeData {
  final String title;
  final String description;
  final int current;
  final int total;
  final int reward;
  final IconData icon;
  final Color color;
  final String expiresIn;

  const ChallengeData({
    required this.title,
    required this.description,
    required this.current,
    required this.total,
    required this.reward,
    required this.icon,
    required this.color,
    required this.expiresIn,
  });
}
