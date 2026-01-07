import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/layout/responsive_layout.dart';
import 'widgets/welcome_banner.dart';
import 'widgets/challenge_status.dart';
import 'widgets/action_buttons.dart';
import 'widgets/reward_summary.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final padding = ResponsiveGrid.padding(context);
    final isDesktop = Breakpoints.isDesktop(context);
    final isTablet = Breakpoints.isTablet(context);

    return SafeArea(
      child: SingleChildScrollView(
        padding: padding,
        child: ResponsiveContainer(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (!isDesktop && !isTablet) ...[
                _buildHeader(),
                const SizedBox(height: 24),
              ],
              if (isDesktop)
                _buildDesktopLayout(context)
              else
                _buildMobileLayout(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDesktopLayout(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // 왼쪽 메인 컬럼
        Expanded(
          flex: 3,
          child: Column(
            children: [
              const WelcomeBanner(userName: 'Player', level: 5),
              const SizedBox(height: 20),
              ChallengeStatusWidget(onViewAll: () => context.go('/challenges')),
              const SizedBox(height: 20),
              _buildDesktopTopSection(),
              const SizedBox(height: 20),
              _buildMiniChart(),
              const SizedBox(height: 20),
              ActionButtons(
                onUpload: () => context.go('/upload'),
                onAnalytics: () => context.go('/analytics'),
              ),
            ],
          ),
        ),
        const SizedBox(width: 24),
        // 오른쪽 사이드 컬럼
        Expanded(
          flex: 2,
          child: Column(
            children: [
              const RewardSummary(),
              const SizedBox(height: 20),
              _buildRecentSessionsCard(),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildMobileLayout(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const WelcomeBanner(userName: 'Player', level: 5),
        const SizedBox(height: 20),
        ChallengeStatusWidget(onViewAll: () => context.go('/challenges')),
        const SizedBox(height: 20),
        _buildTotalProfitCard(),
        const SizedBox(height: 16),
        _buildStatsRow(),
        const SizedBox(height: 20),
        const RewardSummary(),
        const SizedBox(height: 20),
        ActionButtons(
          onUpload: () => context.go('/upload'),
          onAnalytics: () => context.go('/analytics'),
        ),
        const SizedBox(height: 24),
        _buildMiniChart(),
        const SizedBox(height: 24),
        _buildRecentSessionsHeader(),
        const SizedBox(height: 12),
        _buildRecentSessionsList(6),
      ],
    );
  }

  Widget _buildDesktopTopSection() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(flex: 2, child: _buildTotalProfitCard()),
        const SizedBox(width: 16),
        Expanded(
          flex: 3,
          child: Row(
            children: [
              Expanded(child: _buildStatCard(title: 'Today', value: '+\$850', isProfit: true, icon: Icons.today)),
              const SizedBox(width: 12),
              Expanded(child: _buildStatCard(title: 'This Week', value: '+\$2,340', isProfit: true, icon: Icons.date_range)),
              const SizedBox(width: 12),
              Expanded(child: _buildStatCard(title: 'Sessions', value: '47', isProfit: true, icon: Icons.casino)),
            ],
          ),
        ),
      ],
    );
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

  Widget _buildTotalProfitCard() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.profit.withValues(alpha: 0.2), AppColors.profit.withValues(alpha: 0.05)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.profit.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: AppColors.profit.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(8)),
                child: const Icon(Icons.trending_up, color: AppColors.profit, size: 20),
              ),
              const SizedBox(width: 12),
              const Text('Total Profit', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
            ],
          ),
          const SizedBox(height: 16),
          const Text('+\$12,450', style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: AppColors.profit)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 4,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: AppColors.profit.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(6)),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.arrow_upward, color: AppColors.profit, size: 14),
                    SizedBox(width: 4),
                    Text('+23.5%', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.profit)),
                  ],
                ),
              ),
              const Text('vs last month', style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatsRow() {
    return Row(
      children: [
        Expanded(child: _buildStatCard(title: 'Today', value: '+\$850', isProfit: true, icon: Icons.today)),
        const SizedBox(width: 12),
        Expanded(child: _buildStatCard(title: 'This Week', value: '+\$2,340', isProfit: true, icon: Icons.date_range)),
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

  Widget _buildMiniChart() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Weekly Overview', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(6)),
                child: const Text('Last 7 days', style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
              ),
            ],
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 180,
            child: LineChart(
              LineChartData(
                gridData: FlGridData(show: true, drawVerticalLine: false, horizontalInterval: 500, getDrawingHorizontalLine: (value) => FlLine(color: AppColors.chartGrid, strokeWidth: 1)),
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
                minX: 0, maxX: 6, minY: 0, maxY: 1500,
                lineBarsData: [
                  LineChartBarData(
                    spots: const [FlSpot(0, 450), FlSpot(1, 320), FlSpot(2, 780), FlSpot(3, 520), FlSpot(4, 980), FlSpot(5, 850), FlSpot(6, 1200)],
                    isCurved: true, color: AppColors.profit, barWidth: 3, isStrokeCapRound: true,
                    dotData: const FlDotData(show: false),
                    belowBarData: BarAreaData(show: true, color: AppColors.chartFill),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentSessionsCard() {
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
          _buildRecentSessionsList(6),
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

  Widget _buildRecentSessionsList(int count) {
    final sessions = _getSessions().take(count).toList();
    return Column(
      children: sessions.map((s) => _buildSessionCardCompact(s)).toList(),
    );
  }

  List<_SessionData> _getSessions() => [
    _SessionData(date: 'Jan 7, 2026', venue: 'PokerStars', game: 'NL Hold\'em \$1/\$2', duration: '4h 32m', profit: 850),
    _SessionData(date: 'Jan 6, 2026', venue: 'GGPoker', game: 'NL Hold\'em \$0.5/\$1', duration: '2h 15m', profit: -320),
    _SessionData(date: 'Jan 5, 2026', venue: 'PokerStars', game: 'PLO \$0.5/\$1', duration: '3h 45m', profit: 1240),
    _SessionData(date: 'Jan 4, 2026', venue: 'Local Casino', game: 'NL Hold\'em \$2/\$5', duration: '6h 20m', profit: 570),
    _SessionData(date: 'Jan 3, 2026', venue: 'WPT', game: 'Tournament', duration: '5h 10m', profit: 2500),
    _SessionData(date: 'Jan 2, 2026', venue: 'Home Game', game: 'NL Hold\'em \$0.5/\$1', duration: '3h 00m', profit: -150),
  ];

  Widget _buildSessionCardCompact(_SessionData session) {
    final isProfit = session.profit >= 0;
    final profitColor = isProfit ? AppColors.profit : AppColors.loss;
    final profitText = isProfit ? '+\$${session.profit}' : '-\$${session.profit.abs()}';
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            width: 36, height: 36,
            decoration: BoxDecoration(color: profitColor.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(8)),
            child: Icon(isProfit ? Icons.arrow_upward : Icons.arrow_downward, color: profitColor, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(session.venue, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textPrimary)),
                Text('${session.game} • ${session.duration}', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(profitText, style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: profitColor)),
              Text(session.date, style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
            ],
          ),
        ],
      ),
    );
  }
}

class _SessionData {
  final String date, venue, game, duration;
  final int profit;
  _SessionData({required this.date, required this.venue, required this.game, required this.duration, required this.profit});
}
