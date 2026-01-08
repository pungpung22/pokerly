import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/layout/responsive_layout.dart';
import '../../../shared/models/session.dart';
import '../providers/dashboard_provider.dart';
import 'widgets/welcome_banner.dart';
import 'widgets/challenge_status.dart';
import 'widgets/action_buttons.dart';
import 'widgets/reward_summary.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final padding = ResponsiveGrid.padding(context);
    final screenType = Breakpoints.getScreenType(context);
    final statsAsync = ref.watch(sessionNotifierProvider);

    return SafeArea(
      child: SingleChildScrollView(
        padding: padding,
        child: ResponsiveContainer(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (screenType == ScreenType.mobile) ...[
                _buildHeader(),
                const SizedBox(height: 24),
              ],
              statsAsync.when(
                data: (stats) {
                  if (screenType == ScreenType.largeDesktop) {
                    return _buildLargeDesktopLayout(context, ref, stats);
                  } else if (screenType == ScreenType.desktop || screenType == ScreenType.tablet) {
                    return _buildDesktopLayout(context, ref, stats);
                  }
                  return _buildMobileLayout(context, ref, stats);
                },
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (e, _) => Center(child: Text('Error: $e')),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Large Desktop: 3열 레이아웃
  Widget _buildLargeDesktopLayout(BuildContext context, WidgetRef ref, SessionStats stats) {
    final spacing = ResponsiveGrid.spacing(context);

    return Column(
      children: [
        // 상단: Welcome + Challenge + Total Profit
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              flex: 2,
              child: WelcomeBanner(userName: 'Player', level: _calculateLevel(stats.totalSessions)),
            ),
            SizedBox(width: spacing),
            Expanded(
              flex: 2,
              child: ChallengeStatusWidget(onViewAll: () => context.go('/challenges')),
            ),
            SizedBox(width: spacing),
            Expanded(
              flex: 1,
              child: _buildTotalProfitCard(stats.totalProfit),
            ),
          ],
        ),
        SizedBox(height: spacing),
        // 중단: Stats cards + Rewards
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              flex: 3,
              child: Row(
                children: [
                  Expanded(child: _buildStatCard(
                    title: 'Today',
                    value: _formatProfit(stats.todayProfit),
                    isProfit: stats.todayProfit >= 0,
                    icon: Icons.today,
                  )),
                  SizedBox(width: spacing / 2),
                  Expanded(child: _buildStatCard(
                    title: 'This Week',
                    value: _formatProfit(stats.weekProfit),
                    isProfit: stats.weekProfit >= 0,
                    icon: Icons.date_range,
                  )),
                  SizedBox(width: spacing / 2),
                  Expanded(child: _buildStatCard(
                    title: 'Sessions',
                    value: stats.totalSessions.toString(),
                    isProfit: true,
                    icon: Icons.casino,
                  )),
                ],
              ),
            ),
            SizedBox(width: spacing),
            const Expanded(
              flex: 2,
              child: RewardSummary(),
            ),
          ],
        ),
        SizedBox(height: spacing),
        // 하단: Chart 전체 폭 + Recent Sessions
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              flex: 3,
              child: _buildMiniChart(ref, context),
            ),
            SizedBox(width: spacing),
            Expanded(
              flex: 2,
              child: Column(
                children: [
                  _buildRecentSessionsCard(stats.recentSessions),
                  SizedBox(height: spacing),
                  ActionButtons(
                    onUpload: () => context.go('/upload'),
                    onAnalytics: () => context.go('/analytics'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildDesktopLayout(BuildContext context, WidgetRef ref, SessionStats stats) {
    final spacing = ResponsiveGrid.spacing(context);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          flex: 3,
          child: Column(
            children: [
              WelcomeBanner(userName: 'Player', level: _calculateLevel(stats.totalSessions)),
              SizedBox(height: spacing),
              ChallengeStatusWidget(onViewAll: () => context.go('/challenges')),
              SizedBox(height: spacing),
              _buildDesktopTopSection(stats),
              SizedBox(height: spacing),
              _buildMiniChart(ref, context),
              SizedBox(height: spacing),
              ActionButtons(
                onUpload: () => context.go('/upload'),
                onAnalytics: () => context.go('/analytics'),
              ),
            ],
          ),
        ),
        SizedBox(width: spacing),
        Expanded(
          flex: 2,
          child: Column(
            children: [
              const RewardSummary(),
              SizedBox(height: spacing),
              _buildRecentSessionsCard(stats.recentSessions),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildMobileLayout(BuildContext context, WidgetRef ref, SessionStats stats) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        WelcomeBanner(userName: 'Player', level: _calculateLevel(stats.totalSessions)),
        const SizedBox(height: 20),
        ChallengeStatusWidget(onViewAll: () => context.go('/challenges')),
        const SizedBox(height: 20),
        _buildTotalProfitCard(stats.totalProfit),
        const SizedBox(height: 16),
        _buildStatsRow(stats),
        const SizedBox(height: 20),
        const RewardSummary(),
        const SizedBox(height: 20),
        ActionButtons(
          onUpload: () => context.go('/upload'),
          onAnalytics: () => context.go('/analytics'),
        ),
        const SizedBox(height: 24),
        _buildMiniChart(ref, context),
        const SizedBox(height: 24),
        _buildRecentSessionsHeader(),
        const SizedBox(height: 12),
        _buildRecentSessionsList(stats.recentSessions),
      ],
    );
  }

  int _calculateLevel(int totalSessions) {
    if (totalSessions >= 100) return 10;
    if (totalSessions >= 50) return 7;
    if (totalSessions >= 25) return 5;
    if (totalSessions >= 10) return 3;
    return 1;
  }

  Widget _buildDesktopTopSection(SessionStats stats) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(flex: 2, child: _buildTotalProfitCard(stats.totalProfit)),
        const SizedBox(width: 16),
        Expanded(
          flex: 3,
          child: Row(
            children: [
              Expanded(child: _buildStatCard(
                title: 'Today',
                value: _formatProfit(stats.todayProfit),
                isProfit: stats.todayProfit >= 0,
                icon: Icons.today,
              )),
              const SizedBox(width: 12),
              Expanded(child: _buildStatCard(
                title: 'This Week',
                value: _formatProfit(stats.weekProfit),
                isProfit: stats.weekProfit >= 0,
                icon: Icons.date_range,
              )),
              const SizedBox(width: 12),
              Expanded(child: _buildStatCard(
                title: 'Sessions',
                value: stats.totalSessions.toString(),
                isProfit: true,
                icon: Icons.casino,
              )),
            ],
          ),
        ),
      ],
    );
  }

  String _formatProfit(double profit) {
    final sign = profit >= 0 ? '+' : '';
    return '$sign\$${profit.toStringAsFixed(0)}';
  }

  Widget _buildHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Pokerly', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
              SizedBox(height: 4),
              Text('Track your poker journey', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.card,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border),
          ),
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              const Icon(Icons.notifications_outlined, color: AppColors.textSecondary),
              Positioned(
                top: -4,
                right: -4,
                child: Container(
                  width: 10,
                  height: 10,
                  decoration: BoxDecoration(
                    color: AppColors.loss,
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.card, width: 1.5),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildTotalProfitCard(double totalProfit) {
    final isProfit = totalProfit >= 0;
    final color = isProfit ? AppColors.profit : AppColors.loss;

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [color.withValues(alpha: 0.2), color.withValues(alpha: 0.05)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: color.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(8)),
                child: Icon(isProfit ? Icons.trending_up : Icons.trending_down, color: color, size: 20),
              ),
              const SizedBox(width: 12),
              const Text('Total Profit', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
            ],
          ),
          const SizedBox(height: 16),
          Text(_formatProfit(totalProfit), style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: color)),
        ],
      ),
    );
  }

  Widget _buildStatsRow(SessionStats stats) {
    return Row(
      children: [
        Expanded(child: _buildStatCard(
          title: 'Today',
          value: _formatProfit(stats.todayProfit),
          isProfit: stats.todayProfit >= 0,
          icon: Icons.today,
        )),
        const SizedBox(width: 12),
        Expanded(child: _buildStatCard(
          title: 'This Week',
          value: _formatProfit(stats.weekProfit),
          isProfit: stats.weekProfit >= 0,
          icon: Icons.date_range,
        )),
      ],
    );
  }

  Widget _buildStatCard({required String title, required String value, required bool isProfit, required IconData icon}) {
    final color = isProfit ? AppColors.profit : AppColors.loss;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            Icon(icon, size: 16, color: AppColors.textMuted),
            const SizedBox(width: 6),
            Expanded(
              child: Text(title, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary), overflow: TextOverflow.ellipsis),
            ),
          ]),
          const SizedBox(height: 12),
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Text(value, style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: color)),
          ),
        ],
      ),
    );
  }

  Widget _buildMiniChart(WidgetRef ref, BuildContext context) {
    final weeklyAsync = ref.watch(weeklyDataProvider);
    final cardPadding = ResponsiveGrid.cardPadding(context);
    final chartHeight = ResponsiveChart.height(context);
    final titleSize = ResponsiveText.titleSize(context);

    return Container(
      padding: cardPadding,
      decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Weekly Overview', style: TextStyle(fontSize: titleSize, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(6)),
                child: Text('Last 7 days', style: TextStyle(fontSize: ResponsiveText.captionSize(context), color: AppColors.textMuted)),
              ),
            ],
          ),
          SizedBox(height: ResponsiveGrid.spacing(context)),
          SizedBox(
            height: chartHeight,
            child: weeklyAsync.when(
              data: (dailyProfits) => _buildChart(dailyProfits),
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (_, __) => const Center(child: Text('Failed to load chart')),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChart(List<double> dailyProfits) {
    final maxY = dailyProfits.isEmpty ? 100.0 : (dailyProfits.reduce((a, b) => a > b ? a : b).abs() * 1.2).clamp(100.0, double.infinity);
    final spots = dailyProfits.asMap().entries.map((e) => FlSpot(e.key.toDouble(), e.value)).toList();

    return LineChart(
      LineChartData(
        gridData: FlGridData(show: true, drawVerticalLine: false, horizontalInterval: maxY / 3, getDrawingHorizontalLine: (value) => FlLine(color: AppColors.chartGrid, strokeWidth: 1)),
        titlesData: FlTitlesData(
          show: true,
          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 22,
              getTitlesWidget: (value, meta) {
                const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
                if (value.toInt() < days.length) {
                  return Text(days[value.toInt()], style: const TextStyle(color: AppColors.textMuted, fontSize: 12));
                }
                return const Text('');
              },
            ),
          ),
        ),
        borderData: FlBorderData(show: false),
        minX: 0, maxX: 6, minY: 0, maxY: maxY,
        lineBarsData: [
          LineChartBarData(
            spots: spots.isEmpty ? [const FlSpot(0, 0), const FlSpot(6, 0)] : spots,
            isCurved: true, color: AppColors.profit, barWidth: 3, isStrokeCapRound: true,
            dotData: const FlDotData(show: false),
            belowBarData: BarAreaData(show: true, color: AppColors.chartFill),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentSessionsCard(List<Session> sessions) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildRecentSessionsHeader(),
          const SizedBox(height: 16),
          _buildRecentSessionsList(sessions),
        ],
      ),
    );
  }

  Widget _buildRecentSessionsHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text('Recent Sessions', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
        GestureDetector(
          onTap: () {},
          child: const Text('See all', style: TextStyle(color: AppColors.profit, fontSize: 13, fontWeight: FontWeight.w500)),
        ),
      ],
    );
  }

  Widget _buildRecentSessionsList(List<Session> sessions) {
    if (sessions.isEmpty) {
      return Container(
        padding: const EdgeInsets.symmetric(vertical: 32),
        child: const Center(
          child: Text('No sessions yet.\nRecord your first session!', textAlign: TextAlign.center, style: TextStyle(color: AppColors.textMuted)),
        ),
      );
    }
    return Column(
      children: sessions.take(6).map((s) => _buildSessionCardCompact(s)).toList(),
    );
  }

  Widget _buildSessionCardCompact(Session session) {
    final profitColor = session.isProfit ? AppColors.profit : AppColors.loss;
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            width: 36, height: 36,
            decoration: BoxDecoration(color: profitColor.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(8)),
            child: Icon(session.isProfit ? Icons.arrow_upward : Icons.arrow_downward, color: profitColor, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(session.venue, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textPrimary)),
                Text('${session.gameType} ${session.stakes} • ${session.durationFormatted}', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(session.profitFormatted, style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: profitColor)),
              Text(_formatDate(session.date), style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
            ],
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return '${months[date.month - 1]} ${date.day}, ${date.year}';
  }
}
