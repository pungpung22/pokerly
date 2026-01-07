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
              _buildPeriodFilter(),
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

  Widget _buildDesktopLayout() {
    return Column(
      children: [
        // 상단: 차트 + Stats 그리드
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(flex: 3, child: _buildProfitChart()),
            const SizedBox(width: 20),
            Expanded(flex: 2, child: _buildStatsGridDesktop()),
          ],
        ),
        const SizedBox(height: 24),
        // 하단: Venue + Game Type 나란히
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(child: _buildVenueBreakdown()),
            const SizedBox(width: 20),
            Expanded(child: _buildGameTypeChart()),
          ],
        ),
      ],
    );
  }

  Widget _buildMobileLayout() {
    return Column(
      children: [
        _buildProfitChart(),
        const SizedBox(height: 24),
        _buildStatsGrid(),
        const SizedBox(height: 24),
        _buildVenueBreakdown(),
        const SizedBox(height: 24),
        _buildGameTypeChart(),
      ],
    );
  }

  Widget _buildHeader() {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Analytics', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
        SizedBox(height: 4),
        Text('Deep dive into your performance', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
      ],
    );
  }

  Widget _buildPeriodFilter() {
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
                child: Text(period, textAlign: TextAlign.center, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: isSelected ? AppColors.background : AppColors.textSecondary)),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildProfitChart() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Profit Over Time', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: AppColors.profit.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(6)),
                child: const Row(
                  children: [
                    Icon(Icons.arrow_upward, color: AppColors.profit, size: 14),
                    SizedBox(width: 4),
                    Text('+\$8,240', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.profit)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          SizedBox(
            height: 200,
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

  Widget _buildStatsGrid() {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 1.5,
      children: _getStatTiles(),
    );
  }

  Widget _buildStatsGridDesktop() {
    return Column(
      children: [
        Row(children: [
          Expanded(child: _buildStatTile(icon: Icons.casino, title: 'Sessions', value: '47', subtitle: '12 this month')),
          const SizedBox(width: 12),
          Expanded(child: _buildStatTile(icon: Icons.access_time, title: 'Hours Played', value: '186h', subtitle: 'Avg 3.9h/session')),
        ]),
        const SizedBox(height: 12),
        Row(children: [
          Expanded(child: _buildStatTile(icon: Icons.show_chart, title: 'Win Rate', value: '62%', subtitle: '29W / 18L', valueColor: AppColors.profit)),
          const SizedBox(width: 12),
          Expanded(child: _buildStatTile(icon: Icons.attach_money, title: 'Hourly Rate', value: '\$44.6', subtitle: 'BB/hr: 12.5', valueColor: AppColors.profit)),
        ]),
      ],
    );
  }

  List<Widget> _getStatTiles() => [
    _buildStatTile(icon: Icons.casino, title: 'Sessions', value: '47', subtitle: '12 this month'),
    _buildStatTile(icon: Icons.access_time, title: 'Hours Played', value: '186h', subtitle: 'Avg 3.9h/session'),
    _buildStatTile(icon: Icons.show_chart, title: 'Win Rate', value: '62%', subtitle: '29W / 18L', valueColor: AppColors.profit),
    _buildStatTile(icon: Icons.attach_money, title: 'Hourly Rate', value: '\$44.6', subtitle: 'BB/hr: 12.5', valueColor: AppColors.profit),
  ];

  Widget _buildStatTile({required IconData icon, required String title, required String value, required String subtitle, Color? valueColor}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(children: [
            Icon(icon, size: 16, color: AppColors.textMuted),
            const SizedBox(width: 6),
            Text(title, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
          ]),
          Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: valueColor ?? AppColors.textPrimary)),
          Text(subtitle, style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
        ],
      ),
    );
  }

  Widget _buildVenueBreakdown() {
    final venues = [_VenueData('PokerStars', 4250, 0.42), _VenueData('GGPoker', 2180, 0.28), _VenueData('Local Casino', 1810, 0.20)];
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Profit by Venue', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
          const SizedBox(height: 20),
          ...venues.map((venue) => _buildVenueBar(venue)),
        ],
      ),
    );
  }

  Widget _buildVenueBar(_VenueData venue) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(venue.name, style: const TextStyle(fontSize: 14, color: AppColors.textPrimary)),
              Text('+\$${venue.profit}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.profit)),
            ],
          ),
          const SizedBox(height: 8),
          Stack(
            children: [
              Container(height: 8, decoration: BoxDecoration(color: AppColors.border, borderRadius: BorderRadius.circular(4))),
              FractionallySizedBox(
                widthFactor: venue.percentage,
                child: Container(height: 8, decoration: BoxDecoration(color: AppColors.profit, borderRadius: BorderRadius.circular(4))),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildGameTypeChart() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Game Type Distribution', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
          const SizedBox(height: 20),
          Row(
            children: [
              SizedBox(
                width: 120, height: 120,
                child: PieChart(PieChartData(
                  sectionsSpace: 2,
                  centerSpaceRadius: 30,
                  sections: [
                    PieChartSectionData(value: 65, color: AppColors.profit, title: '', radius: 25),
                    PieChartSectionData(value: 25, color: AppColors.promotion, title: '', radius: 25),
                    PieChartSectionData(value: 10, color: AppColors.textMuted, title: '', radius: 25),
                  ],
                )),
              ),
              const SizedBox(width: 24),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildLegendItem('NL Hold\'em', '65%', AppColors.profit),
                    const SizedBox(height: 12),
                    _buildLegendItem('PLO', '25%', AppColors.promotion),
                    const SizedBox(height: 12),
                    _buildLegendItem('Others', '10%', AppColors.textMuted),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLegendItem(String label, String value, Color color) {
    return Row(
      children: [
        Container(width: 12, height: 12, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(3))),
        const SizedBox(width: 8),
        Text(label, style: const TextStyle(fontSize: 13, color: AppColors.textSecondary)),
        const Spacer(),
        Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
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
