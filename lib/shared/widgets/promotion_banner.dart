import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

class PromotionBanner extends StatelessWidget {
  final String title;
  final String? description;
  final String? buttonText;
  final VoidCallback? onButtonTap;
  final IconData icon;
  final Color? backgroundColor;
  final bool showArrow;

  const PromotionBanner({
    super.key,
    required this.title,
    this.description,
    this.buttonText,
    this.onButtonTap,
    this.icon = Icons.auto_awesome,
    this.backgroundColor,
    this.showArrow = true,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            backgroundColor ?? AppColors.promotion,
            (backgroundColor ?? AppColors.promotion).withValues(alpha: 0.7),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: Colors.white, size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                if (description != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    description!,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.white.withValues(alpha: 0.9),
                    ),
                  ),
                ],
              ],
            ),
          ),
          if (buttonText != null)
            GestureDetector(
              onTap: onButtonTap,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      buttonText!,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: backgroundColor ?? AppColors.promotion,
                      ),
                    ),
                    if (showArrow) ...[
                      const SizedBox(width: 4),
                      Icon(
                        Icons.arrow_forward,
                        size: 14,
                        color: backgroundColor ?? AppColors.promotion,
                      ),
                    ],
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
