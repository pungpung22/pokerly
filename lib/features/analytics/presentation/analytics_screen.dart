import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/layout/responsive_layout.dart';

class AnalyticsScreen extends StatefulWidget {
  const AnalyticsScreen({super.key});

  @override
  State<AnalyticsScreen> createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends State<AnalyticsScreen> {
  String _selectedPeriod = '30D';

  @override
  Widget build(BuildContext context) {
    final padding = ResponsiveGrid.padding(context);
    final spacing = ResponsiveGrid.spacing(context);
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
              SizedBox(height: spacing),
              _buildPeriodFilter(context),
              SizedBox(height: spacing),
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

  Widget _buildDesktopLayout(BuildContext context) {
    final spacing = ResponsiveGrid.spacing(context);

    return Column(
      children: [
        // 상단: 차트 전체 폭으로 크게
        _buildProfitChart(context),
        SizedBox(height: spacing),
        // 중단: Stats 그리드
        _buildStatsGridDesktop(context),
        SizedBox(height: spacing),
        // 하단: Venue + Game Type 나란히
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(child: _buildVenueBreakdown(context)),
            SizedBox(width: spacing),
            Expanded(child: _buildGameTypeChart(context)),
          ],
        ),
      ],
    );
  }

  Widget _buildMobileLayout(BuildContext context) {
    final spacing = ResponsiveGrid.spacing(context);

    return Column(
      children: [
        _buildProfitChart(context),
        SizedBox(height: spacing),
        _buildStatsGrid(context),
        SizedBox(height: spacing),
        _buildVenueBreakdown(context),
        SizedBox(height: spacing),
        _buildGameTypeChart(context),
      ],
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Analytics', style: TextStyle(fontSize: ResponsiveText.headlineSize(context), fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
        const SizedBox(height: 4),
        Text('Deep dive into your performance', style: TextStyle(fontSize: ResponsiveText.bodySize(context), color: AppColors.textSecondary)),
      ],
    );
  }

  Widget _buildPeriodFilter(BuildContext context) {
    final periods = ['7D', '30D', '90D', '1Y', 'ALL'];
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
      child: Row(
        children: periods.map((period) {
          final isSelected = _selectedPeriod == period;
          return Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _selectedPeriod = period),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(color: isSelected ? AppColors.profit : Colors.transparent, borderRadius: BorderRadius.circular(8)),
                child: Text(period, textAlign: TextAlign.center, style: TextStyle(fontSize: ResponsiveText.bodySize(context), fontWeight: FontWeight.w600, color: isSelected ? AppColors.background : AppColors.textSecondary)),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildProfitChart(BuildContext context) {
    final cardPadding = ResponsiveGrid.cardPadding(context);
    final chartHeight = ResponsiveChart.height(context);
    final spacing = ResponsiveGrid.spacing(context);

    return Container(
      padding: cardPadding,
      decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Profit Over Time', style: TextStyle(fontSize: ResponsiveText.titleSize(context), fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: AppColors.profit.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(6)),
                child: Row(
                  children: [
                    const Icon(Icons.arrow_upward, color: AppColors.profit, size: 14),
                    const SizedBox(width: 4),
                    Text('+\$8,240', style: TextStyle(fontSize: ResponsiveText.captionSize(context), fontWeight: FontWeight.w600, color: AppColors.profit)),
                  ],
                ),
              ),
            ],
          ),
          SizedBox(height: spacing),
          SizedBox(
            height: chartHeight,
            child: LineChart(
              LineChartData(
                gridData: FlGridData(show: true, drawVerticalLine: false, horizontalInterval: 2000, getDrawingHorizontalLine: (value) => FlLine(color: AppColors.chartGrid, strokeWidth: 1)),
                titlesData: FlTitlesData(
                  show: true,
                  rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  leftTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 50,
                      getTitlesWidget: (value, meta) => Text('\$${value.toInt()}', style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
                    ),
                  ),
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 22,
                      getTitlesWidget: (value, meta) {
                        final labels = ['W1', 'W2', 'W3', 'W4'];
                        if (value.toInt() < labels.length) {
                          return Text(labels[value.toInt()], style: const TextStyle(color: AppColors.textMuted, fontSize: 12));
                        }
                        return const Text('');
                      },
                    ),
                  ),
                ),
                borderData: FlBorderData(show: false),
                minX: 0, maxX: 3, minY: 0, maxY: 10000,
                lineBarsData: [
                  LineChartBarData(
                    spots: const [FlSpot(0, 2450), FlSpot(1, 4200), FlSpot(2, 5800), FlSpot(3, 8240)],
                    isCurved: true, color: AppColors.profit, barWidth: 3, isStrokeCapRound: true,
                    dotData: FlDotData(show: true, getDotPainter: (spot, percent, barData, index) => FlDotCirclePainter(radius: 4, color: AppColors.profit, strokeWidth: 2, strokeColor: AppColors.background)),
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

  Widget _buildStatsGrid(BuildContext context) {
    final spacing = ResponsiveGrid.spacing(context) * 0.6;

    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: spacing,
      crossAxisSpacing: spacing,
      childAspectRatio: 1.5,
      children: _getStatTiles(context),
    );
  }

  Widget _buildStatsGridDesktop(BuildContext context) {
    final spacing = ResponsiveGrid.spacing(context) * 0.6;

    return Row(
      children: [
        Expanded(child: _buildStatTile(context, icon: Icons.casino, title: 'Sessions', value: '47', subtitle: '12 this month')),
        SizedBox(width: spacing),
        Expanded(child: _buildStatTile(context, icon: Icons.access_time, title: 'Hours Played', value: '186h', subtitle: 'Avg 3.9h/session')),
        SizedBox(width: spacing),
        Expanded(child: _buildStatTile(context, icon: Icons.show_chart, title: 'Win Rate', value: '62%', subtitle: '29W / 18L', valueColor: AppColors.profit)),
        SizedBox(width: spacing),
        Expanded(child: _buildStatTile(context, icon: Icons.attach_money, title: 'Hourly Rate', value: '\$44.6', subtitle: 'BB/hr: 12.5', valueColor: AppColors.profit)),
      ],
    );
  }

  List<Widget> _getStatTiles(BuildContext context) => [
    _buildStatTile(context, icon: Icons.casino, title: 'Sessions', value: '47', subtitle: '12 this month'),
    _buildStatTile(context, icon: Icons.access_time, title: 'Hours Played', value: '186h', subtitle: 'Avg 3.9h/session'),
    _buildStatTile(context, icon: Icons.show_chart, title: 'Win Rate', value: '62%', subtitle: '29W / 18L', valueColor: AppColors.profit),
    _buildStatTile(context, icon: Icons.attach_money, title: 'Hourly Rate', value: '\$44.6', subtitle: 'BB/hr: 12.5', valueColor: AppColors.profit),
  ];

  Widget _buildStatTile(BuildContext context, {required IconData icon, required String title, required String value, required String subtitle, Color? valueColor}) {
    final cardPadding = ResponsiveGrid.cardPadding(context);

    return Container(
      padding: cardPadding,
      decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(children: [
            Icon(icon, size: 16, color: AppColors.textMuted),
            const SizedBox(width: 6),
            Text(title, style: TextStyle(fontSize: ResponsiveText.captionSize(context), color: AppColors.textSecondary)),
          ]),
          Text(value, style: TextStyle(fontSize: ResponsiveText.displaySize(context) * 0.85, fontWeight: FontWeight.bold, color: valueColor ?? AppColors.textPrimary)),
          Text(subtitle, style: TextStyle(fontSize: ResponsiveText.captionSize(context) - 1, color: AppColors.textMuted)),
        ],
      ),
    );
  }

  Widget _buildVenueBreakdown(BuildContext context) {
    final venues = [_VenueData('PokerStars', 4250, 0.42), _VenueData('GGPoker', 2180, 0.28), _VenueData('Local Casino', 1810, 0.20)];
    final cardPadding = ResponsiveGrid.cardPadding(context);
    final spacing = ResponsiveGrid.spacing(context);

    return Container(
      padding: cardPadding,
      decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Profit by Venue', style: TextStyle(fontSize: ResponsiveText.titleSize(context), fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
          SizedBox(height: spacing),
          ...venues.map((venue) => _buildVenueBar(venue, context)),
        ],
      ),
    );
  }

  Widget _buildVenueBar(_VenueData venue, BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: ResponsiveGrid.spacing(context) * 0.75),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(venue.name, style: TextStyle(fontSize: ResponsiveText.bodySize(context), color: AppColors.textPrimary)),
              Text('+\$${venue.profit}', style: TextStyle(fontSize: ResponsiveText.bodySize(context), fontWeight: FontWeight.w600, color: AppColors.profit)),
            ],
          ),
          const SizedBox(height: 8),
          Stack(
            children: [
              Container(height: 10, decoration: BoxDecoration(color: AppColors.border, borderRadius: BorderRadius.circular(5))),
              FractionallySizedBox(
                widthFactor: venue.percentage,
                child: Container(height: 10, decoration: BoxDecoration(color: AppColors.profit, borderRadius: BorderRadius.circular(5))),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildGameTypeChart(BuildContext context) {
    final cardPadding = ResponsiveGrid.cardPadding(context);
    final spacing = ResponsiveGrid.spacing(context);
    // PC에서 파이 차트 크기 증가
    final pieSize = ResponsiveValue.of<double>(context, mobile: 120, tablet: 140, desktop: 160, largeDesktop: 180);

    return Container(
      padding: cardPadding,
      decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Game Type Distribution', style: TextStyle(fontSize: ResponsiveText.titleSize(context), fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
          SizedBox(height: spacing),
          Row(
            children: [
              SizedBox(
                width: pieSize, height: pieSize,
                child: PieChart(PieChartData(
                  sectionsSpace: 2,
                  centerSpaceRadius: pieSize * 0.25,
                  sections: [
                    PieChartSectionData(value: 65, color: AppColors.profit, title: '', radius: pieSize * 0.2),
                    PieChartSectionData(value: 25, color: AppColors.promotion, title: '', radius: pieSize * 0.2),
                    PieChartSectionData(value: 10, color: AppColors.textMuted, title: '', radius: pieSize * 0.2),
                  ],
                )),
              ),
              SizedBox(width: spacing),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildLegendItem('NL Hold\'em', '65%', AppColors.profit, context),
                    SizedBox(height: spacing * 0.5),
                    _buildLegendItem('PLO', '25%', AppColors.promotion, context),
                    SizedBox(height: spacing * 0.5),
                    _buildLegendItem('Others', '10%', AppColors.textMuted, context),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLegendItem(String label, String value, Color color, BuildContext context) {
    return Row(
      children: [
        Container(width: 14, height: 14, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(3))),
        const SizedBox(width: 10),
        Text(label, style: TextStyle(fontSize: ResponsiveText.bodySize(context), color: AppColors.textSecondary)),
        const Spacer(),
        Text(value, style: TextStyle(fontSize: ResponsiveText.bodySize(context), fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
      ],
    );
  }
}

class _VenueData {
  final String name;
  final int profit;
  final double percentage;
  _VenueData(this.name, this.profit, this.percentage);
}
