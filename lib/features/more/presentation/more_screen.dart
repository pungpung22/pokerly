import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/layout/responsive_layout.dart';

class MoreScreen extends StatelessWidget {
  const MoreScreen({super.key});

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
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Column(
            children: [
              _buildProfileSection(),
              const SizedBox(height: 24),
              _buildPreferencesSection(),
            ],
          ),
        ),
        const SizedBox(width: 24),
        Expanded(
          child: Column(
            children: [
              _buildSupportSection(),
              const SizedBox(height: 24),
              _buildAppInfoSection(),
              const SizedBox(height: 24),
              _buildLogoutButton(),
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
        _buildProfileSection(),
        const SizedBox(height: 24),
        _buildPreferencesSection(),
        const SizedBox(height: 24),
        _buildSupportSection(),
        const SizedBox(height: 24),
        _buildAppInfoSection(),
        const SizedBox(height: 32),
        _buildLogoutButton(),
      ],
    );
  }

  Widget _buildHeader() {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'More',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
          ),
        ),
        SizedBox(height: 4),
        Text(
          'Settings and preferences',
          style: TextStyle(
            fontSize: 14,
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _buildProfileSection() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [AppColors.profit, AppColors.profit.withValues(alpha: 0.6)],
              ),
              shape: BoxShape.circle,
            ),
            child: const Center(
              child: Text(
                'G',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppColors.background,
                ),
              ),
            ),
          ),
          const SizedBox(width: 16),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      'Guest',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    SizedBox(width: 8),
                    _LevelBadge(level: 1),
                  ],
                ),
                SizedBox(height: 4),
                Text(
                  '로그인하여 데이터를 저장하세요',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(
              Icons.edit_outlined,
              color: AppColors.textSecondary,
              size: 20,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPreferencesSection() {
    return _buildSection(
      title: 'Preferences',
      items: [
        _SettingItem(icon: Icons.attach_money, title: 'Currency', subtitle: 'USD (\$)', onTap: () {}),
        _SettingItem(icon: Icons.language, title: 'Language', subtitle: 'English', onTap: () {}),
        _SettingItem(icon: Icons.notifications_outlined, title: 'Notifications', subtitle: 'Enabled', onTap: () {}),
        _SettingItem(icon: Icons.palette_outlined, title: 'Appearance', subtitle: 'Dark mode', onTap: () {}),
      ],
    );
  }

  Widget _buildSupportSection() {
    return _buildSection(
      title: 'Support',
      items: [
        _SettingItem(icon: Icons.help_outline, title: 'Help Center', subtitle: 'FAQs and guides', onTap: () {}),
        _SettingItem(icon: Icons.mail_outline, title: 'Contact Developer', subtitle: 'pung0805@gmail.com', onTap: () {}),
        _SettingItem(icon: Icons.star_outline, title: 'Rate App', subtitle: 'Leave a review', onTap: () {}),
      ],
    );
  }

  Widget _buildAppInfoSection() {
    return _buildSection(
      title: 'About',
      items: [
        _SettingItem(icon: Icons.description_outlined, title: 'Privacy Policy', onTap: () {}),
        _SettingItem(icon: Icons.article_outlined, title: 'Terms of Service', onTap: () {}),
        _SettingItem(icon: Icons.info_outline, title: 'App Version', subtitle: '1.0.0', showArrow: false, onTap: () {}),
      ],
    );
  }

  Widget _buildSection({required String title, required List<_SettingItem> items}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 12),
          child: Text(
            title,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppColors.textMuted,
              letterSpacing: 0.5,
            ),
          ),
        ),
        Container(
          decoration: BoxDecoration(
            color: AppColors.card,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            children: items.asMap().entries.map((entry) {
              final index = entry.key;
              final item = entry.value;
              final isLast = index == items.length - 1;
              return _buildSettingTile(item, isLast);
            }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildSettingTile(_SettingItem item, bool isLast) {
    return InkWell(
      onTap: item.onTap,
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
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(item.icon, color: AppColors.textSecondary, size: 20),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.title,
                    style: const TextStyle(
                      fontSize: 15,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  if (item.subtitle != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      item.subtitle!,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.textMuted,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            if (item.showArrow)
              const Icon(Icons.arrow_forward_ios, color: AppColors.textMuted, size: 14),
          ],
        ),
      ),
    );
  }

  Widget _buildLogoutButton() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
        color: AppColors.loss.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.loss.withValues(alpha: 0.3)),
      ),
      child: const Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.logout, color: AppColors.loss, size: 20),
          SizedBox(width: 8),
          Text(
            'Log Out',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.loss,
            ),
          ),
        ],
      ),
    );
  }
}

class _SettingItem {
  final IconData icon;
  final String title;
  final String? subtitle;
  final bool showArrow;
  final VoidCallback onTap;

  _SettingItem({
    required this.icon,
    required this.title,
    this.subtitle,
    this.showArrow = true,
    required this.onTap,
  });
}

class _LevelBadge extends StatelessWidget {
  final int level;

  const _LevelBadge({required this.level});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.profit.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: AppColors.profit.withValues(alpha: 0.3)),
      ),
      child: Text(
        'Lv.$level',
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: AppColors.profit,
        ),
      ),
    );
  }
}
