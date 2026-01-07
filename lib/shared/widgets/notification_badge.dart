import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

class NotificationBadge extends StatelessWidget {
  final Widget child;
  final int count;
  final bool showDot;
  final Color? badgeColor;
  final double? top;
  final double? right;

  const NotificationBadge({
    super.key,
    required this.child,
    this.count = 0,
    this.showDot = false,
    this.badgeColor,
    this.top,
    this.right,
  });

  @override
  Widget build(BuildContext context) {
    final shouldShowBadge = showDot || count > 0;

    if (!shouldShowBadge) return child;

    return Stack(
      clipBehavior: Clip.none,
      children: [
        child,
        Positioned(
          top: top ?? -4,
          right: right ?? -4,
          child: showDot
              ? _buildDot()
              : _buildCountBadge(),
        ),
      ],
    );
  }

  Widget _buildDot() {
    return Container(
      width: 8,
      height: 8,
      decoration: BoxDecoration(
        color: badgeColor ?? AppColors.loss,
        shape: BoxShape.circle,
        border: Border.all(color: AppColors.background, width: 1.5),
      ),
    );
  }

  Widget _buildCountBadge() {
    final displayCount = count > 99 ? '99+' : count.toString();

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
      constraints: const BoxConstraints(minWidth: 16),
      decoration: BoxDecoration(
        color: badgeColor ?? AppColors.loss,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppColors.background, width: 1.5),
      ),
      child: Text(
        displayCount,
        textAlign: TextAlign.center,
        style: const TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
    );
  }
}

class IconWithBadge extends StatelessWidget {
  final IconData icon;
  final int count;
  final bool showDot;
  final double iconSize;
  final Color? iconColor;
  final Color? badgeColor;
  final VoidCallback? onTap;

  const IconWithBadge({
    super.key,
    required this.icon,
    this.count = 0,
    this.showDot = false,
    this.iconSize = 24,
    this.iconColor,
    this.badgeColor,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: NotificationBadge(
        count: count,
        showDot: showDot,
        badgeColor: badgeColor,
        child: Icon(
          icon,
          size: iconSize,
          color: iconColor ?? AppColors.textSecondary,
        ),
      ),
    );
  }
}

class NavItemWithBadge extends StatelessWidget {
  final IconData icon;
  final IconData? activeIcon;
  final String label;
  final bool isSelected;
  final int badgeCount;
  final bool showDot;
  final VoidCallback onTap;

  const NavItemWithBadge({
    super.key,
    required this.icon,
    this.activeIcon,
    required this.label,
    required this.isSelected,
    this.badgeCount = 0,
    this.showDot = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          NotificationBadge(
            count: badgeCount,
            showDot: showDot,
            top: -2,
            right: -6,
            child: Icon(
              isSelected ? (activeIcon ?? icon) : icon,
              size: 24,
              color: isSelected ? AppColors.profit : AppColors.textMuted,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
              color: isSelected ? AppColors.profit : AppColors.textMuted,
            ),
          ),
        ],
      ),
    );
  }
}
