import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/layout/responsive_layout.dart';

class MainScaffold extends StatelessWidget {
  final Widget child;

  const MainScaffold({super.key, required this.child});

  static const _navItems = [
    _NavItemData(
      path: '/dashboard',
      icon: Icons.dashboard_outlined,
      activeIcon: Icons.dashboard,
      label: 'Dashboard',
    ),
    _NavItemData(
      path: '/analytics',
      icon: Icons.analytics_outlined,
      activeIcon: Icons.analytics,
      label: 'Analytics',
    ),
    _NavItemData(
      path: '/upload',
      icon: Icons.add_photo_alternate_outlined,
      activeIcon: Icons.add_photo_alternate,
      label: 'Upload',
    ),
    _NavItemData(
      path: '/settings',
      icon: Icons.settings_outlined,
      activeIcon: Icons.settings,
      label: 'Settings',
    ),
  ];

  int _getCurrentIndex(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    for (int i = 0; i < _navItems.length; i++) {
      if (location == _navItems[i].path) return i;
    }
    return 0;
  }

  void _onTap(BuildContext context, int index) {
    context.go(_navItems[index].path);
  }

  @override
  Widget build(BuildContext context) {
    final currentIndex = _getCurrentIndex(context);

    return ResponsiveLayout(
      // 모바일: 하단 네비게이션
      mobile: _MobileScaffold(
        child: child,
        currentIndex: currentIndex,
        navItems: _navItems,
        onTap: (index) => _onTap(context, index),
      ),
      // 태블릿: 사이드 Rail (아이콘만)
      tablet: _TabletScaffold(
        child: child,
        currentIndex: currentIndex,
        navItems: _navItems,
        onTap: (index) => _onTap(context, index),
      ),
      // 데스크톱: 넓은 사이드바
      desktop: _DesktopScaffold(
        child: child,
        currentIndex: currentIndex,
        navItems: _navItems,
        onTap: (index) => _onTap(context, index),
      ),
    );
  }
}

/// 모바일 레이아웃 - 하단 네비게이션
class _MobileScaffold extends StatelessWidget {
  final Widget child;
  final int currentIndex;
  final List<_NavItemData> navItems;
  final ValueChanged<int> onTap;

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
              children: List.generate(
                navItems.length,
                (index) => _BottomNavItem(
                  icon: navItems[index].icon,
                  activeIcon: navItems[index].activeIcon,
                  label: navItems[index].label,
                  isActive: currentIndex == index,
                  onTap: () => onTap(index),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// 태블릿 레이아웃 - NavigationRail (아이콘만)
class _TabletScaffold extends StatelessWidget {
  final Widget child;
  final int currentIndex;
  final List<_NavItemData> navItems;
  final ValueChanged<int> onTap;

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
          // NavigationRail
          Container(
            width: 72,
            decoration: const BoxDecoration(
              color: AppColors.card,
              border: Border(
                right: BorderSide(color: AppColors.border, width: 1),
              ),
            ),
            child: SafeArea(
              child: Column(
                children: [
                  const SizedBox(height: 16),
                  // 로고
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
                  const SizedBox(height: 32),
                  // 네비게이션 아이템들
                  ...List.generate(
                    navItems.length,
                    (index) => _RailNavItem(
                      icon: navItems[index].icon,
                      activeIcon: navItems[index].activeIcon,
                      isActive: currentIndex == index,
                      onTap: () => onTap(index),
                    ),
                  ),
                ],
              ),
            ),
          ),
          // 컨텐츠
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
  final ValueChanged<int> onTap;

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
          // 사이드바
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
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: Column(
                      children: List.generate(
                        navItems.length,
                        (index) => _SidebarNavItem(
                          icon: navItems[index].icon,
                          activeIcon: navItems[index].activeIcon,
                          label: navItems[index].label,
                          isActive: currentIndex == index,
                          onTap: () => onTap(index),
                        ),
                      ),
                    ),
                  ),
                  const Spacer(),
                  // 하단 유저 정보 영역
                  const Divider(color: AppColors.border, height: 1),
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 18,
                          backgroundColor: AppColors.profit.withValues(alpha: 0.2),
                          child: const Icon(
                            Icons.person,
                            color: AppColors.profit,
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Guest User',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                              Text(
                                'Free Plan',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: AppColors.textMuted,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          // 컨텐츠
          Expanded(child: child),
        ],
      ),
    );
  }
}

// === 네비게이션 아이템 위젯들 ===

class _NavItemData {
  final String path;
  final IconData icon;
  final IconData activeIcon;
  final String label;

  const _NavItemData({
    required this.path,
    required this.icon,
    required this.activeIcon,
    required this.label,
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
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
                fontSize: 12,
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

/// 태블릿 Rail 네비게이션 아이템
class _RailNavItem extends StatelessWidget {
  final IconData icon;
  final IconData activeIcon;
  final bool isActive;
  final VoidCallback onTap;

  const _RailNavItem({
    required this.icon,
    required this.activeIcon,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: isActive ? AppColors.profit.withValues(alpha: 0.15) : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(
            isActive ? activeIcon : icon,
            color: isActive ? AppColors.profit : AppColors.textMuted,
            size: 24,
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
  final VoidCallback onTap;

  const _SidebarNavItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.isActive,
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
                Icon(
                  isActive ? activeIcon : icon,
                  color: isActive ? AppColors.profit : AppColors.textMuted,
                  size: 22,
                ),
                const SizedBox(width: 14),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
                    color: isActive ? AppColors.profit : AppColors.textSecondary,
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
