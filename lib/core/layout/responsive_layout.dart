import 'package:flutter/material.dart';

/// 반응형 브레이크포인트 정의
class Breakpoints {
  // Mobile first breakpoints
  static const double mobile = 0;
  static const double tablet = 768;
  static const double desktop = 1024;
  static const double largeDesktop = 1440;

  // 현재 화면 타입 확인
  static ScreenType getScreenType(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width < tablet) return ScreenType.mobile;
    if (width < desktop) return ScreenType.tablet;
    if (width < largeDesktop) return ScreenType.desktop;
    return ScreenType.largeDesktop;
  }

  static bool isMobile(BuildContext context) =>
      MediaQuery.of(context).size.width < tablet;

  static bool isTablet(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    return width >= tablet && width < desktop;
  }

  static bool isDesktop(BuildContext context) =>
      MediaQuery.of(context).size.width >= desktop;

  static bool isLargeDesktop(BuildContext context) =>
      MediaQuery.of(context).size.width >= largeDesktop;

  // PC 환경 체크 (tablet 이상)
  static bool isDesktopOrTablet(BuildContext context) =>
      MediaQuery.of(context).size.width >= tablet;
}

enum ScreenType { mobile, tablet, desktop, largeDesktop }

/// 반응형 레이아웃 빌더
class ResponsiveLayout extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;
  final Widget? desktop;
  final Widget? largeDesktop;

  const ResponsiveLayout({
    super.key,
    required this.mobile,
    this.tablet,
    this.desktop,
    this.largeDesktop,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth >= Breakpoints.largeDesktop) {
          return largeDesktop ?? desktop ?? tablet ?? mobile;
        }
        if (constraints.maxWidth >= Breakpoints.desktop) {
          return desktop ?? tablet ?? mobile;
        }
        if (constraints.maxWidth >= Breakpoints.tablet) {
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
    T? largeDesktop,
  }) {
    final screenType = Breakpoints.getScreenType(context);
    switch (screenType) {
      case ScreenType.largeDesktop:
        return largeDesktop ?? desktop ?? tablet ?? mobile;
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
      largeDesktop: 4,
    );
  }

  static double spacing(BuildContext context) {
    return ResponsiveValue.of(
      context,
      mobile: 16.0,
      tablet: 20.0,
      desktop: 24.0,
      largeDesktop: 32.0,
    );
  }

  static EdgeInsets padding(BuildContext context) {
    return ResponsiveValue.of(
      context,
      mobile: const EdgeInsets.all(16),
      tablet: const EdgeInsets.all(24),
      desktop: const EdgeInsets.all(32),
      largeDesktop: const EdgeInsets.all(40),
    );
  }

  /// 카드 내부 패딩
  static EdgeInsets cardPadding(BuildContext context) {
    return ResponsiveValue.of(
      context,
      mobile: const EdgeInsets.all(16),
      tablet: const EdgeInsets.all(20),
      desktop: const EdgeInsets.all(24),
      largeDesktop: const EdgeInsets.all(28),
    );
  }
}

/// 반응형 텍스트 스케일
class ResponsiveText {
  /// 본문 텍스트 (base: 14)
  static double bodySize(BuildContext context) {
    return ResponsiveValue.of(
      context,
      mobile: 14.0,
      tablet: 15.0,
      desktop: 16.0,
      largeDesktop: 16.0,
    );
  }

  /// 제목 텍스트 (base: 16)
  static double titleSize(BuildContext context) {
    return ResponsiveValue.of(
      context,
      mobile: 16.0,
      tablet: 18.0,
      desktop: 20.0,
      largeDesktop: 22.0,
    );
  }

  /// 큰 제목 텍스트 (base: 24)
  static double headlineSize(BuildContext context) {
    return ResponsiveValue.of(
      context,
      mobile: 24.0,
      tablet: 28.0,
      desktop: 32.0,
      largeDesktop: 36.0,
    );
  }

  /// 숫자/금액 표시용 큰 텍스트 (base: 28)
  static double displaySize(BuildContext context) {
    return ResponsiveValue.of(
      context,
      mobile: 28.0,
      tablet: 32.0,
      desktop: 36.0,
      largeDesktop: 42.0,
    );
  }

  /// 캡션/라벨 텍스트 (base: 12)
  static double captionSize(BuildContext context) {
    return ResponsiveValue.of(
      context,
      mobile: 12.0,
      tablet: 13.0,
      desktop: 14.0,
      largeDesktop: 14.0,
    );
  }
}

/// 반응형 차트 크기
class ResponsiveChart {
  static double height(BuildContext context) {
    return ResponsiveValue.of(
      context,
      mobile: 180.0,
      tablet: 250.0,
      desktop: 320.0,
      largeDesktop: 400.0,
    );
  }

  static double miniHeight(BuildContext context) {
    return ResponsiveValue.of(
      context,
      mobile: 150.0,
      tablet: 200.0,
      desktop: 250.0,
      largeDesktop: 300.0,
    );
  }
}

/// 반응형 컨테이너 (최대 너비 제한 - PC에서는 더 넓게)
class ResponsiveContainer extends StatelessWidget {
  final Widget child;
  final double? maxWidth;
  final EdgeInsets? padding;
  final bool centerContent;

  const ResponsiveContainer({
    super.key,
    required this.child,
    this.maxWidth,
    this.padding,
    this.centerContent = true,
  });

  @override
  Widget build(BuildContext context) {
    // PC에서는 최대 너비를 더 넓게 설정
    final double effectiveMaxWidth = maxWidth ??
        ResponsiveValue.of<double>(
          context,
          mobile: double.infinity,
          tablet: double.infinity, // 태블릿에서 전체 너비 사용
          desktop: 1400.0,
          largeDesktop: 1800.0,
        );

    final hasMaxWidth = effectiveMaxWidth < double.infinity;

    final content = Container(
      constraints: hasMaxWidth
          ? BoxConstraints(maxWidth: effectiveMaxWidth)
          : null,
      padding: padding,
      child: child,
    );

    if (centerContent && hasMaxWidth) {
      return Center(child: content);
    }
    return content;
  }
}

/// 반응형 그리드 레이아웃 위젯
class ResponsiveGridView extends StatelessWidget {
  final List<Widget> children;
  final int? mobileColumns;
  final int? tabletColumns;
  final int? desktopColumns;
  final int? largeDesktopColumns;
  final double? spacing;
  final double? runSpacing;

  const ResponsiveGridView({
    super.key,
    required this.children,
    this.mobileColumns,
    this.tabletColumns,
    this.desktopColumns,
    this.largeDesktopColumns,
    this.spacing,
    this.runSpacing,
  });

  @override
  Widget build(BuildContext context) {
    final columns = ResponsiveValue.of(
      context,
      mobile: mobileColumns ?? 1,
      tablet: tabletColumns ?? 2,
      desktop: desktopColumns ?? 3,
      largeDesktop: largeDesktopColumns ?? desktopColumns ?? 3,
    );

    final effectiveSpacing = spacing ?? ResponsiveGrid.spacing(context);

    return LayoutBuilder(
      builder: (context, constraints) {
        final itemWidth = (constraints.maxWidth - (effectiveSpacing * (columns - 1))) / columns;

        return Wrap(
          spacing: effectiveSpacing,
          runSpacing: runSpacing ?? effectiveSpacing,
          children: children.map((child) {
            return SizedBox(
              width: itemWidth,
              child: child,
            );
          }).toList(),
        );
      },
    );
  }
}

/// 반응형 2열 레이아웃 (좌:우 비율 조절 가능)
class ResponsiveTwoColumn extends StatelessWidget {
  final Widget left;
  final Widget right;
  final int leftFlex;
  final int rightFlex;
  final double? spacing;
  final bool stackOnMobile;

  const ResponsiveTwoColumn({
    super.key,
    required this.left,
    required this.right,
    this.leftFlex = 1,
    this.rightFlex = 1,
    this.spacing,
    this.stackOnMobile = true,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveSpacing = spacing ?? ResponsiveGrid.spacing(context);
    final isMobile = Breakpoints.isMobile(context);

    if (isMobile && stackOnMobile) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          left,
          SizedBox(height: effectiveSpacing),
          right,
        ],
      );
    }

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(flex: leftFlex, child: left),
        SizedBox(width: effectiveSpacing),
        Expanded(flex: rightFlex, child: right),
      ],
    );
  }
}

/// 반응형 3열 레이아웃
class ResponsiveThreeColumn extends StatelessWidget {
  final Widget first;
  final Widget second;
  final Widget third;
  final int firstFlex;
  final int secondFlex;
  final int thirdFlex;
  final double? spacing;
  final bool stackOnMobile;
  final bool twoColumnOnTablet;

  const ResponsiveThreeColumn({
    super.key,
    required this.first,
    required this.second,
    required this.third,
    this.firstFlex = 1,
    this.secondFlex = 1,
    this.thirdFlex = 1,
    this.spacing,
    this.stackOnMobile = true,
    this.twoColumnOnTablet = true,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveSpacing = spacing ?? ResponsiveGrid.spacing(context);
    final screenType = Breakpoints.getScreenType(context);

    if (screenType == ScreenType.mobile && stackOnMobile) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          first,
          SizedBox(height: effectiveSpacing),
          second,
          SizedBox(height: effectiveSpacing),
          third,
        ],
      );
    }

    if (screenType == ScreenType.tablet && twoColumnOnTablet) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(flex: firstFlex, child: first),
              SizedBox(width: effectiveSpacing),
              Expanded(flex: secondFlex, child: second),
            ],
          ),
          SizedBox(height: effectiveSpacing),
          third,
        ],
      );
    }

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(flex: firstFlex, child: first),
        SizedBox(width: effectiveSpacing),
        Expanded(flex: secondFlex, child: second),
        SizedBox(width: effectiveSpacing),
        Expanded(flex: thirdFlex, child: third),
      ],
    );
  }
}
