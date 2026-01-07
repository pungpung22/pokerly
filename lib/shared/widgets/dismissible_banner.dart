import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

class DismissibleBanner extends StatefulWidget {
  final String title;
  final String? description;
  final IconData icon;
  final Color? backgroundColor;
  final VoidCallback? onDismiss;
  final VoidCallback? onTap;
  final String? actionText;

  const DismissibleBanner({
    super.key,
    required this.title,
    this.description,
    this.icon = Icons.info_outline,
    this.backgroundColor,
    this.onDismiss,
    this.onTap,
    this.actionText,
  });

  @override
  State<DismissibleBanner> createState() => _DismissibleBannerState();
}

class _DismissibleBannerState extends State<DismissibleBanner> {
  bool _isDismissed = false;

  @override
  Widget build(BuildContext context) {
    if (_isDismissed) return const SizedBox.shrink();

    final bgColor = widget.backgroundColor ?? AppColors.promotion;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [bgColor, bgColor.withValues(alpha: 0.8)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(widget.icon, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.title,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                if (widget.description != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    widget.description!,
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.white.withValues(alpha: 0.9),
                      height: 1.4,
                    ),
                  ),
                ],
                if (widget.actionText != null && widget.onTap != null) ...[
                  const SizedBox(height: 12),
                  GestureDetector(
                    onTap: widget.onTap,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        widget.actionText!,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: bgColor,
                        ),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(width: 8),
          GestureDetector(
            onTap: () {
              setState(() => _isDismissed = true);
              widget.onDismiss?.call();
            },
            child: Container(
              padding: const EdgeInsets.all(4),
              child: Icon(
                Icons.close,
                color: Colors.white.withValues(alpha: 0.8),
                size: 18,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class WelcomeBanner extends StatefulWidget {
  final String userName;
  final VoidCallback? onDismiss;

  const WelcomeBanner({
    super.key,
    required this.userName,
    this.onDismiss,
  });

  @override
  State<WelcomeBanner> createState() => _WelcomeBannerState();
}

class _WelcomeBannerState extends State<WelcomeBanner> {
  bool _isDismissed = false;

  @override
  Widget build(BuildContext context) {
    if (_isDismissed) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.profit.withValues(alpha: 0.15),
            AppColors.promotion.withValues(alpha: 0.15),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.profit.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.profit.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.waving_hand, color: AppColors.profit, size: 28),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '안녕하세요, ${widget.userName}님!',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  '오늘도 좋은 결과 있으시길 바랍니다 🎯',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          GestureDetector(
            onTap: () {
              setState(() => _isDismissed = true);
              widget.onDismiss?.call();
            },
            child: Container(
              padding: const EdgeInsets.all(8),
              child: const Icon(
                Icons.close,
                color: AppColors.textMuted,
                size: 20,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
