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
    final isDesktop = Breakpoints.isDesktop(context);

    return SafeArea(
      child: SingleChildScrollView(
        padding: padding,
        child: ResponsiveContainer(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(),
              const SizedBox(height: 24),
              if (isDesktop)
                _buildDesktopLayout()
              else
                _buildMobileLayout(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Challenges',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
          ),
        ),
        SizedBox(height: 4),
        Text(
          'Complete challenges to earn rewards',
          style: TextStyle(
            fontSize: 14,
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _buildDesktopLayout() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          flex: 3,
          child: Column(
            children: [
              const ChallengeHeader(),
              const SizedBox(height: 24),
              const TogetherStatsBar(),
              const SizedBox(height: 24),
              const ActiveChallenges(),
            ],
          ),
        ),
        const SizedBox(width: 24),
        Expanded(
          flex: 2,
          child: Column(
            children: [
              const TrophyRoom(),
              const SizedBox(height: 24),
              _buildUpcomingChallenges(),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildMobileLayout() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const ChallengeHeader(),
        const SizedBox(height: 24),
        const TogetherStatsBar(),
        const SizedBox(height: 24),
        const ActiveChallenges(),
        const SizedBox(height: 24),
        const TrophyRoom(),
        const SizedBox(height: 24),
        _buildUpcomingChallenges(),
      ],
    );
  }

  Widget _buildUpcomingChallenges() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Coming Soon',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(20),
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
              const SizedBox(height: 16),
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
