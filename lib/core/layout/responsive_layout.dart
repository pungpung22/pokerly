import 'package:flutter/material.dart';

/// 반응형 브레이크포인트 정의
class Breakpoints {
  static const double mobile = 600;
  static const double tablet = 1200;

  // 현재 화면 타입 확인
  static ScreenType getScreenType(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width < mobile) return ScreenType.mobile;
    if (width < tablet) return ScreenType.tablet;
    return ScreenType.desktop;
  }

  static bool isMobile(BuildContext context) =>
      MediaQuery.of(context).size.width < mobile;

  static bool isTablet(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    return width >= mobile && width < tablet;
  }

  static bool isDesktop(BuildContext context) =>
      MediaQuery.of(context).size.width >= tablet;
}

enum ScreenType { mobile, tablet, desktop }

/// 반응형 레이아웃 빌더
class ResponsiveLayout extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;
  final Widget? desktop;

  const ResponsiveLayout({
    super.key,
    required this.mobile,
    this.tablet,
    this.desktop,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth >= Breakpoints.tablet) {
          return desktop ?? tablet ?? mobile;
        }
        if (constraints.maxWidth >= Breakpoints.mobile) {
          return tablet ?? mobile;
        }
        return mobile;
      },
    );
  }
}

/// 반응형 값 선택 헬퍼
class ResponsiveValue {
  static T of<T>(
    BuildContext context, {
    required T mobile,
    T? tablet,
    T? desktop,
  }) {
    final screenType = Breakpoints.getScreenType(context);
    switch (screenType) {
      case ScreenType.desktop:
        return desktop ?? tablet ?? mobile;
      case ScreenType.tablet:
        return tablet ?? mobile;
      case ScreenType.mobile:
        return mobile;
    }
  }
}

/// 반응형 그리드 컬럼 수
class ResponsiveGrid {
  static int columns(BuildContext context) {
    return ResponsiveValue.of(
      context,
      mobile: 1,
      tablet: 2,
      desktop: 3,
    );
  }

  static double spacing(BuildContext context) {
    return ResponsiveValue.of(
      context,
      mobile: 16.0,
      tablet: 20.0,
      desktop: 24.0,
    );
  }

  static EdgeInsets padding(BuildContext context) {
    return ResponsiveValue.of(
      context,
      mobile: const EdgeInsets.all(16),
      tablet: const EdgeInsets.all(24),
      desktop: const EdgeInsets.all(32),
    );
  }
}

/// 반응형 컨테이너 (최대 너비 제한)
class ResponsiveContainer extends StatelessWidget {
  final Widget child;
  final double maxWidth;
  final EdgeInsets? padding;

  const ResponsiveContainer({
    super.key,
    required this.child,
    this.maxWidth = 1400,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        constraints: BoxConstraints(maxWidth: maxWidth),
        padding: padding ?? ResponsiveGrid.padding(context),
        child: child,
      ),
    );
  }
}
