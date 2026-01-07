import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class RewardSummary extends StatelessWidget {
  final int totalRewards;
  final int pendingRewards;
  final int thisMonth;
  final VoidCallback? onViewDetails;

  const RewardSummary({
    super.key,
    this.totalRewards = 125000,
    this.pendingRewards = 15000,
    this.thisMonth = 35000,
    this.onViewDetails,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.promotion.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.card_giftcard, color: AppColors.promotion, size: 18),
                  ),
                  const SizedBox(width: 10),
                  const Text(
                    'Rewards',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
              GestureDetector(
                onTap: onViewDetails,
                child: const Text(
                  'View Details',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: AppColors.profit,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          LayoutBuilder(
            builder: (context, constraints) {
              if (constraints.maxWidth < 300) {
                return Column(
                  children: [
                    _buildRewardItem('Total Earned', totalRewards, AppColors.profit),
                    const SizedBox(height: 12),
                    _buildRewardItem('Pending', pendingRewards, AppColors.promotion),
                    const SizedBox(height: 12),
                    _buildRewardItem('This Month', thisMonth, AppColors.textPrimary),
                  ],
                );
              }
              return Row(
                children: [
                  Expanded(child: _buildRewardItem('Total Earned', totalRewards, AppColors.profit)),
                  Container(width: 1, height: 40, color: AppColors.divider),
                  Expanded(child: _buildRewardItem('Pending', pendingRewards, AppColors.promotion)),
                  Container(width: 1, height: 40, color: AppColors.divider),
                  Expanded(child: _buildRewardItem('This Month', thisMonth, AppColors.textPrimary)),
                ],
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildRewardItem(String label, int amount, Color valueColor) {
    return Column(
      children: [
        Text(
          '₩${_formatNumber(amount)}',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: valueColor,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            fontSize: 11,
            color: AppColors.textMuted,
          ),
        ),
      ],
    );
  }

  String _formatNumber(int number) {
    if (number >= 10000) {
      return '${(number / 10000).toStringAsFixed(number % 10000 == 0 ? 0 : 1)}만';
    } else if (number >= 1000) {
      return '${(number / 1000).toStringAsFixed(0)}K';
    }
    return number.toString();
  }
}
