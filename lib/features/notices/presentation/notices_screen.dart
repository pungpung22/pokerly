import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/layout/responsive_layout.dart';
import '../../../shared/widgets/pill_button.dart';
import 'widgets/subscribe_banner.dart';
import 'widgets/notice_list.dart';

class NoticesScreen extends StatefulWidget {
  const NoticesScreen({super.key});

  @override
  State<NoticesScreen> createState() => _NoticesScreenState();
}

class _NoticesScreenState extends State<NoticesScreen> {
  int _selectedCategory = 0;
  final List<String> _categories = ['All', 'Update', 'Event', 'Maintenance'];

  @override
  Widget build(BuildContext context) {
    final padding = ResponsiveGrid.padding(context);
    final isDesktop = Breakpoints.isDesktop(context);

    return SafeArea(
      child: SingleChildScrollView(
        padding: padding,
        child: ResponsiveContainer(
          maxWidth: isDesktop ? 1000 : 1400,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(),
              const SizedBox(height: 24),
              const SubscribeBanner(),
              const SizedBox(height: 24),
              _buildCategoryFilter(),
              const SizedBox(height: 20),
              const NoticeList(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Notices',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            SizedBox(height: 4),
            Text(
              'Stay updated with latest news',
              style: TextStyle(
                fontSize: 14,
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: AppColors.loss.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: const BoxDecoration(
                  color: AppColors.loss,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 6),
              const Text(
                '2 New',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppColors.loss,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCategoryFilter() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: _categories.asMap().entries.map((entry) {
          final index = entry.key;
          final category = entry.value;
          return Padding(
            padding: EdgeInsets.only(right: index < _categories.length - 1 ? 8 : 0),
            child: PillButton(
              label: category,
              isActive: _selectedCategory == index,
              onTap: () => setState(() => _selectedCategory = index),
            ),
          );
        }).toList(),
      ),
    );
  }
}
