import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

class LevelBadge extends StatelessWidget {
  final int level;
  final double fontSize;
  final EdgeInsets padding;
  final bool showIcon;

  const LevelBadge({
    super.key,
    required this.level,
    this.fontSize = 12,
    this.padding = const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
    this.showIcon = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: AppColors.profit.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: AppColors.profit.withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (showIcon) ...[
            Icon(
              Icons.star,
              size: fontSize + 2,
              color: AppColors.profit,
            ),
            const SizedBox(width: 4),
          ],
          Text(
            'Lv.$level',
            style: TextStyle(
              fontSize: fontSize,
              fontWeight: FontWeight.w600,
              color: AppColors.profit,
            ),
          ),
        ],
      ),
    );
  }
}

enum PlayerLevel {
  fish('피쉬', Icons.waves, Color(0xFF64B5F6)),
  beginner('초보', Icons.eco, Color(0xFF81C784)),
  intermediate('중수', Icons.trending_up, Color(0xFFFFD54F)),
  advanced('고수', Icons.local_fire_department, Color(0xFFFF8A65)),
  pro('프로', Icons.diamond, Color(0xFFBA68C8)),
  master('마스터', Icons.military_tech, Color(0xFFFFD700));

  final String label;
  final IconData icon;
  final Color color;

  const PlayerLevel(this.label, this.icon, this.color);
}

class PlayerLevelBadge extends StatelessWidget {
  final PlayerLevel level;
  final bool showLabel;
  final double iconSize;

  const PlayerLevelBadge({
    super.key,
    required this.level,
    this.showLabel = true,
    this.iconSize = 16,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: level.color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: level.color.withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(level.icon, size: iconSize, color: level.color),
          if (showLabel) ...[
            const SizedBox(width: 6),
            Text(
              level.label,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: level.color,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
