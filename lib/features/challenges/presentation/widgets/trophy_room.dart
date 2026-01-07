import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class TrophyRoom extends StatelessWidget {
  final List<TrophyData> trophies;

  const TrophyRoom({
    super.key,
    this.trophies = const [],
  });

  static final List<TrophyData> sampleTrophies = [
    TrophyData(
      title: 'First Blood',
      description: 'Complete your first challenge',
      earnedAt: '2024-01-15',
      icon: Icons.military_tech,
      color: const Color(0xFFCD7F32), // Bronze
      rarity: 'Common',
    ),
    TrophyData(
      title: 'Streak Master',
      description: 'Win 10 games in a row',
      earnedAt: '2024-01-20',
      icon: Icons.local_fire_department,
      color: const Color(0xFFC0C0C0), // Silver
      rarity: 'Rare',
    ),
    TrophyData(
      title: 'High Roller',
      description: 'Earn ₩1,000,000 total profit',
      earnedAt: '2024-02-01',
      icon: Icons.diamond,
      color: const Color(0xFFFFD700), // Gold
      rarity: 'Legendary',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final displayTrophies = trophies.isEmpty ? sampleTrophies : trophies;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Trophy Room',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            GestureDetector(
              onTap: () {},
              child: const Text(
                'View All',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: AppColors.profit,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Container(
          decoration: BoxDecoration(
            color: AppColors.card,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            children: displayTrophies.asMap().entries.map((entry) {
              final index = entry.key;
              final trophy = entry.value;
              final isLast = index == displayTrophies.length - 1;
              return _TrophyItem(trophy: trophy, isLast: isLast);
            }).toList(),
          ),
        ),
      ],
    );
  }
}

class _TrophyItem extends StatelessWidget {
  final TrophyData trophy;
  final bool isLast;

  const _TrophyItem({
    required this.trophy,
    required this.isLast,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: isLast ? null : const Border(bottom: BorderSide(color: AppColors.divider)),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [trophy.color, trophy.color.withValues(alpha: 0.6)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: trophy.color.withValues(alpha: 0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Icon(trophy.icon, color: Colors.white, size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      trophy.title,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(width: 8),
                    _buildRarityBadge(trophy.rarity),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  trophy.description,
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
              const Icon(Icons.check_circle, color: AppColors.profit, size: 20),
              const SizedBox(height: 4),
              Text(
                _formatDate(trophy.earnedAt),
                style: const TextStyle(
                  fontSize: 11,
                  color: AppColors.textMuted,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRarityBadge(String rarity) {
    Color color;
    switch (rarity.toLowerCase()) {
      case 'legendary':
        color = const Color(0xFFFFD700);
        break;
      case 'rare':
        color = const Color(0xFF9C27B0);
        break;
      case 'uncommon':
        color = const Color(0xFF2196F3);
        break;
      default:
        color = AppColors.textMuted;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        rarity,
        style: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w600,
          color: color,
        ),
      ),
    );
  }

  String _formatDate(String dateStr) {
    try {
      final date = DateTime.parse(dateStr);
      return '${date.month}/${date.day}/${date.year}';
    } catch (e) {
      return dateStr;
    }
  }
}

class TrophyData {
  final String title;
  final String description;
  final String earnedAt;
  final IconData icon;
  final Color color;
  final String rarity;

  const TrophyData({
    required this.title,
    required this.description,
    required this.earnedAt,
    required this.icon,
    required this.color,
    required this.rarity,
  });
}
