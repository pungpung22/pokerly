import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/layout/responsive_layout.dart';
import 'widgets/challenge_header.dart';
import 'widgets/together_stats_bar.dart';
import 'widgets/active_challenges.dart';
import 'widgets/trophy_room.dart';

class ChallengesScreen extends StatelessWidget {
  const ChallengesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final padding = ResponsiveGrid.padding(context);
    // 태블릿 이상에서 2열 레이아웃 사용
    final useDesktopLayout = Breakpoints.isDesktopOrTablet(context);

    return SafeArea(
      child: SingleChildScrollView(
        padding: padding,
        child: ResponsiveContainer(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(context),
              SizedBox(height: ResponsiveGrid.spacing(context)),
              if (useDesktopLayout)
                _buildDesktopLayout(context)
              else
                _buildMobileLayout(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Challenges',
          style: TextStyle(
            fontSize: ResponsiveText.headlineSize(context),
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Complete challenges to earn rewards',
          style: TextStyle(
            fontSize: ResponsiveText.bodySize(context),
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _buildDesktopLayout(BuildContext context) {
    final spacing = ResponsiveGrid.spacing(context);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          flex: 3,
          child: Column(
            children: [
              const ChallengeHeader(),
              SizedBox(height: spacing),
              const TogetherStatsBar(),
              SizedBox(height: spacing),
              const ActiveChallenges(),
            ],
          ),
        ),
        SizedBox(width: spacing),
        Expanded(
          flex: 2,
          child: Column(
            children: [
              const TrophyRoom(),
              SizedBox(height: spacing),
              _buildUpcomingChallenges(context),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildMobileLayout(BuildContext context) {
    final spacing = ResponsiveGrid.spacing(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const ChallengeHeader(),
        SizedBox(height: spacing),
        const TogetherStatsBar(),
        SizedBox(height: spacing),
        const ActiveChallenges(),
        SizedBox(height: spacing),
        const TrophyRoom(),
        SizedBox(height: spacing),
        _buildUpcomingChallenges(context),
      ],
    );
  }

  Widget _buildUpcomingChallenges(BuildContext context) {
    final cardPadding = ResponsiveGrid.cardPadding(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Coming Soon',
          style: TextStyle(
            fontSize: ResponsiveText.titleSize(context),
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
          ),
        ),
        SizedBox(height: ResponsiveGrid.spacing(context) * 0.75),
        Container(
          padding: cardPadding,
          decoration: BoxDecoration(
            color: AppColors.card,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            children: [
              _buildUpcomingItem(
                'Daily Login Streak',
                'Login for 7 consecutive days',
                Icons.calendar_today,
                'Starts in 2 days',
              ),
              SizedBox(height: ResponsiveGrid.spacing(context) * 0.75),
              _buildUpcomingItem(
                'Weekend Warrior',
                'Play 20 games this weekend',
                Icons.weekend,
                'Starts Fri 6PM',
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildUpcomingItem(String title, String description, IconData icon, String timing) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: AppColors.background,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: AppColors.textMuted, size: 20),
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
                  fontWeight: FontWeight.w500,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                description,
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: AppColors.promotion.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(6),
          ),
          child: Text(
            timing,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w500,
              color: AppColors.promotion,
            ),
          ),
        ),
      ],
    );
  }
}
