import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/layout/responsive_layout.dart';

class MainScaffold extends StatelessWidget {
  final Widget child;

  const MainScaffold({super.key, required this.child});

  // PC 사이드바: 7개 메뉴
  static const _sidebarItems = [
    _NavItemData(path: '/', icon: Icons.home_outlined, activeIcon: Icons.home, label: 'Home'),
    _NavItemData(path: '/challenges', icon: Icons.emoji_events_outlined, activeIcon: Icons.emoji_events, label: 'Challenges'),
    _NavItemData(path: '/analytics', icon: Icons.analytics_outlined, activeIcon: Icons.analytics, label: 'Analytics'),
    _NavItemData(path: '/upload', icon: Icons.add_photo_alternate_outlined, activeIcon: Icons.add_photo_alternate, label: 'Upload'),
    _NavItemData(path: '/notices', icon: Icons.notifications_outlined, activeIcon: Icons.notifications, label: 'Notices', hasBadge: true),
    _NavItemData(path: '/feedback', icon: Icons.chat_bubble_outline, activeIcon: Icons.chat_bubble, label: 'Feedback'),
    _NavItemData(path: '/more', icon: Icons.more_horiz, activeIcon: Icons.more_horiz, label: 'More'),
  ];

  // 모바일 하단 네비: 5개 메뉴
  static const _mobileNavItems = [
    _NavItemData(path: '/', icon: Icons.home_outlined, activeIcon: Icons.home, label: 'Home'),
    _NavItemData(path: '/challenges', icon: Icons.emoji_events_outlined, activeIcon: Icons.emoji_events, label: 'Challenges'),
    _NavItemData(path: '/analytics', icon: Icons.analytics_outlined, activeIcon: Icons.analytics, label: 'Analytics'),
    _NavItemData(path: '/upload', icon: Icons.add_photo_alternate_outlined, activeIcon: Icons.add_photo_alternate, label: 'Upload'),
    _NavItemData(path: '/more', icon: Icons.more_horiz, activeIcon: Icons.more_horiz, label: 'More'),
  ];

  int _getCurrentIndex(BuildContext context, List<_NavItemData> items) {
    final location = GoRouterState.of(context).uri.path;
    for (int i = 0; i < items.length; i++) {
      if (location == items[i].path) return i;
    }
    return 0;
  }

  void _onTap(BuildContext context, String path) {
    context.go(path);
  }

  @override
  Widget build(BuildContext context) {
    return ResponsiveLayout(
      mobile: _MobileScaffold(
        child: child,
        currentIndex: _getCurrentIndex(context, _mobileNavItems),
        navItems: _mobileNavItems,
        onTap: (path) => _onTap(context, path),
      ),
      tablet: _TabletScaffold(
        child: child,
        currentIndex: _getCurrentIndex(context, _sidebarItems),
        navItems: _sidebarItems,
        onTap: (path) => _onTap(context, path),
      ),
      desktop: _DesktopScaffold(
        child: child,
        currentIndex: _getCurrentIndex(context, _sidebarItems),
        navItems: _sidebarItems,
        onTap: (path) => _onTap(context, path),
      ),
    );
  }
}

/// 모바일 레이아웃 - 하단 네비게이션 (5개)
class _MobileScaffold extends StatelessWidget {
  final Widget child;
  final int currentIndex;
  final List<_NavItemData> navItems;
  final ValueChanged<String> onTap;

  const _MobileScaffold({
    required this.child,
    required this.currentIndex,
    required this.navItems,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: AppColors.card,
          border: Border(
            top: BorderSide(color: AppColors.border, width: 1),
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: navItems.asMap().entries.map((entry) {
                final index = entry.key;
                final item = entry.value;
                return _BottomNavItem(
                  icon: item.icon,
                  activeIcon: item.activeIcon,
                  label: item.label,
                  isActive: currentIndex == index,
                  onTap: () => onTap(item.path),
                );
              }).toList(),
            ),
          ),
        ),
      ),
    );
  }
}

/// 태블릿 레이아웃 - 컴팩트 사이드바 (아이콘 + 레이블)
class _TabletScaffold extends StatelessWidget {
  final Widget child;
  final int currentIndex;
  final List<_NavItemData> navItems;
  final ValueChanged<String> onTap;

  const _TabletScaffold({
    required this.child,
    required this.currentIndex,
    required this.navItems,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          Container(
            width: 200, // 태블릿에서도 텍스트 보이도록 넓힘
            decoration: const BoxDecoration(
              color: AppColors.card,
              border: Border(
                right: BorderSide(color: AppColors.border, width: 1),
              ),
            ),
            child: SafeArea(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 로고 + 타이틀
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: AppColors.profit.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(
                            Icons.casino,
                            color: AppColors.profit,
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 10),
                        const Text(
                          'Pokerly',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Divider(color: AppColors.border, height: 1),
                  const SizedBox(height: 12),
                  // 네비게이션 아이템들
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                      child: Column(
                        children: navItems.asMap().entries.map((entry) {
                          final index = entry.key;
                          final item = entry.value;
                          return _CompactSidebarNavItem(
                            icon: item.icon,
                            activeIcon: item.activeIcon,
                            label: item.label,
                            isActive: currentIndex == index,
                            hasBadge: item.hasBadge,
                            onTap: () => onTap(item.path),
                          );
                        }).toList(),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Expanded(child: child),
        ],
      ),
    );
  }
}

/// 데스크톱 레이아웃 - 넓은 사이드바
class _DesktopScaffold extends StatelessWidget {
  final Widget child;
  final int currentIndex;
  final List<_NavItemData> navItems;
  final ValueChanged<String> onTap;

  const _DesktopScaffold({
    required this.child,
    required this.currentIndex,
    required this.navItems,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          Container(
            width: 260,
            decoration: const BoxDecoration(
              color: AppColors.card,
              border: Border(
                right: BorderSide(color: AppColors.border, width: 1),
              ),
            ),
            child: SafeArea(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 로고 + 타이틀
                  Padding(
                    padding: const EdgeInsets.all(24),
                    child: Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: AppColors.profit.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(
                            Icons.casino,
                            color: AppColors.profit,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Text(
                          'Pokerly',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Divider(color: AppColors.border, height: 1),
                  const SizedBox(height: 16),
                  // 네비게이션 아이템들
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: Column(
                        children: navItems.asMap().entries.map((entry) {
                          final index = entry.key;
                          final item = entry.value;
                          return _SidebarNavItem(
                            icon: item.icon,
                            activeIcon: item.activeIcon,
                            label: item.label,
                            isActive: currentIndex == index,
                            hasBadge: item.hasBadge,
                            onTap: () => onTap(item.path),
                          );
                        }).toList(),
                      ),
                    ),
                  ),
                  // 하단 링크들
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      children: [
                        const Divider(color: AppColors.border, height: 1),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            _buildFooterLink('Terms'),
                            const Text(' · ', style: TextStyle(color: AppColors.textMuted)),
                            _buildFooterLink('Privacy'),
                          ],
                        ),
                        const SizedBox(height: 12),
                      ],
                    ),
                  ),
                  // 하단 유저 정보 영역
                  const Divider(color: AppColors.border, height: 1),
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        Container(
                          width: 36,
                          height: 36,
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
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: AppColors.background,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  const Text(
                                    'Guest',
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: AppColors.textPrimary,
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: AppColors.profit.withValues(alpha: 0.15),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: const Text(
                                      'Lv.1',
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.w600,
                                        color: AppColors.profit,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 2),
                              const Text(
                                'Free Plan',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: AppColors.textMuted,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Row(
                          children: [
                            _buildIconButton(Icons.card_giftcard, AppColors.promotion),
                            const SizedBox(width: 4),
                            _buildIconButton(Icons.logout, AppColors.loss),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          Expanded(child: child),
        ],
      ),
    );
  }

  Widget _buildFooterLink(String text) {
    return GestureDetector(
      onTap: () {},
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 12,
          color: AppColors.textMuted,
        ),
      ),
    );
  }

  Widget _buildIconButton(IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(6),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Icon(icon, size: 16, color: color),
    );
  }
}

// === 네비게이션 아이템 데이터 ===

class _NavItemData {
  final String path;
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final bool hasBadge;

  const _NavItemData({
    required this.path,
    required this.icon,
    required this.activeIcon,
    required this.label,
    this.hasBadge = false,
  });
}

/// 모바일 하단 네비게이션 아이템
class _BottomNavItem extends StatelessWidget {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _BottomNavItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              isActive ? activeIcon : icon,
              color: isActive ? AppColors.profit : AppColors.textMuted,
              size: 24,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
                color: isActive ? AppColors.profit : AppColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// 태블릿 컴팩트 사이드바 네비게이션 아이템
class _CompactSidebarNavItem extends StatelessWidget {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final bool isActive;
  final bool hasBadge;
  final VoidCallback onTap;

  const _CompactSidebarNavItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.isActive,
    this.hasBadge = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 2),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(8),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            decoration: BoxDecoration(
              color: isActive ? AppColors.profit.withValues(alpha: 0.15) : Colors.transparent,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                Stack(
                  clipBehavior: Clip.none,
                  children: [
                    Icon(
                      isActive ? activeIcon : icon,
                      color: isActive ? AppColors.profit : AppColors.textMuted,
                      size: 20,
                    ),
                    if (hasBadge)
                      Positioned(
                        top: -2,
                        right: -2,
                        child: Container(
                          width: 6,
                          height: 6,
                          decoration: BoxDecoration(
                            color: AppColors.loss,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: isActive ? AppColors.profit.withValues(alpha: 0.15) : AppColors.card,
                              width: 1,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    label,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
                      color: isActive ? AppColors.profit : AppColors.textSecondary,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// 데스크톱 사이드바 네비게이션 아이템
class _SidebarNavItem extends StatelessWidget {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final bool isActive;
  final bool hasBadge;
  final VoidCallback onTap;

  const _SidebarNavItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.isActive,
    this.hasBadge = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(10),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: isActive ? AppColors.profit.withValues(alpha: 0.15) : Colors.transparent,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              children: [
                Stack(
                  clipBehavior: Clip.none,
                  children: [
                    Icon(
                      isActive ? activeIcon : icon,
                      color: isActive ? AppColors.profit : AppColors.textMuted,
                      size: 22,
                    ),
                    if (hasBadge)
                      Positioned(
                        top: -2,
                        right: -2,
                        child: Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: AppColors.loss,
                            shape: BoxShape.circle,
                            border: Border.all(color: isActive ? AppColors.profit.withValues(alpha: 0.15) : AppColors.card, width: 1.5),
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Text(
                    label,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
                      color: isActive ? AppColors.profit : AppColors.textSecondary,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
