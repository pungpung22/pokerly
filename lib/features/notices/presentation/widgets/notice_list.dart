import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class NoticeList extends StatelessWidget {
  final List<NoticeData> notices;
  final VoidCallback? onLoadMore;
  final bool hasMore;

  const NoticeList({
    super.key,
    this.notices = const [],
    this.onLoadMore,
    this.hasMore = true,
  });

  static final List<NoticeData> sampleNotices = [
    NoticeData(
      id: '1',
      title: 'New Challenge System Launch!',
      content: 'We\'re excited to announce our new challenge system. Complete challenges to earn rewards!',
      category: 'Update',
      createdAt: DateTime.now().subtract(const Duration(hours: 2)),
      isNew: true,
      isPinned: true,
    ),
    NoticeData(
      id: '2',
      title: 'Server Maintenance Notice',
      content: 'Scheduled maintenance on Jan 10th from 2AM to 4AM KST.',
      category: 'Maintenance',
      createdAt: DateTime.now().subtract(const Duration(days: 1)),
      isNew: true,
    ),
    NoticeData(
      id: '3',
      title: 'Holiday Event Rewards',
      content: 'Special holiday rewards are now available! Check your inbox.',
      category: 'Event',
      createdAt: DateTime.now().subtract(const Duration(days: 3)),
    ),
    NoticeData(
      id: '4',
      title: 'App Update v1.2.0',
      content: 'New features and bug fixes in the latest update.',
      category: 'Update',
      createdAt: DateTime.now().subtract(const Duration(days: 7)),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final displayNotices = notices.isEmpty ? sampleNotices : notices;

    return Column(
      children: [
        Container(
          decoration: BoxDecoration(
            color: AppColors.card,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            children: displayNotices.asMap().entries.map((entry) {
              final index = entry.key;
              final notice = entry.value;
              final isLast = index == displayNotices.length - 1;
              return _NoticeItem(notice: notice, isLast: isLast);
            }).toList(),
          ),
        ),
        if (hasMore) ...[
          const SizedBox(height: 16),
          GestureDetector(
            onTap: onLoadMore,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.border),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Load More',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  SizedBox(width: 6),
                  Icon(Icons.keyboard_arrow_down, color: AppColors.textSecondary, size: 20),
                ],
              ),
            ),
          ),
        ],
      ],
    );
  }
}

class _NoticeItem extends StatelessWidget {
  final NoticeData notice;
  final bool isLast;

  const _NoticeItem({
    required this.notice,
    required this.isLast,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        // TODO: Navigate to notice detail
      },
      borderRadius: isLast
          ? const BorderRadius.only(
              bottomLeft: Radius.circular(12),
              bottomRight: Radius.circular(12),
            )
          : null,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          border: isLast ? null : const Border(bottom: BorderSide(color: AppColors.divider)),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (notice.isPinned)
              Padding(
                padding: const EdgeInsets.only(right: 8, top: 2),
                child: Icon(
                  Icons.push_pin,
                  size: 16,
                  color: AppColors.promotion,
                ),
              ),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      _buildCategoryBadge(notice.category),
                      if (notice.isNew) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.loss,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            'NEW',
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    notice.title,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    notice.content,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 13,
                      color: AppColors.textSecondary,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _formatDate(notice.createdAt),
                    style: const TextStyle(
                      fontSize: 11,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios, color: AppColors.textMuted, size: 14),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryBadge(String category) {
    Color color;
    switch (category.toLowerCase()) {
      case 'update':
        color = AppColors.profit;
        break;
      case 'event':
        color = AppColors.promotion;
        break;
      case 'maintenance':
        color = const Color(0xFFFF9800);
        break;
      default:
        color = AppColors.textMuted;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        category,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: color,
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);

    if (diff.inMinutes < 60) {
      return '${diff.inMinutes}m ago';
    } else if (diff.inHours < 24) {
      return '${diff.inHours}h ago';
    } else if (diff.inDays < 7) {
      return '${diff.inDays}d ago';
    } else {
      return '${date.month}/${date.day}/${date.year}';
    }
  }
}

class NoticeData {
  final String id;
  final String title;
  final String content;
  final String category;
  final DateTime createdAt;
  final bool isNew;
  final bool isPinned;

  const NoticeData({
    required this.id,
    required this.title,
    required this.content,
    required this.category,
    required this.createdAt,
    this.isNew = false,
    this.isPinned = false,
  });
}
