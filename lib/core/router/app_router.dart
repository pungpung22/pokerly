import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../features/dashboard/presentation/dashboard_screen.dart';
import '../../features/analytics/presentation/analytics_screen.dart';
import '../../features/upload/presentation/upload_screen.dart';
import '../../features/upload/presentation/manual_entry_screen.dart';
import '../../features/challenges/presentation/challenges_screen.dart';
import '../../features/notices/presentation/notices_screen.dart';
import '../../features/feedback/presentation/feedback_screen.dart';
import '../../features/more/presentation/more_screen.dart';
import '../../shared/widgets/main_scaffold.dart';

class AppRouter {
  static final _rootNavigatorKey = GlobalKey<NavigatorState>();
  static final _shellNavigatorKey = GlobalKey<NavigatorState>();

  static final GoRouter router = GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/',
    routes: [
      // Manual entry route outside ShellRoute
      GoRoute(
        path: '/upload/manual',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const ManualEntryScreen(),
      ),
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        builder: (context, state, child) => MainScaffold(child: child),
        routes: [
          GoRoute(
            path: '/',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: DashboardScreen(),
            ),
          ),
          GoRoute(
            path: '/challenges',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: ChallengesScreen(),
            ),
          ),
          GoRoute(
            path: '/analytics',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: AnalyticsScreen(),
            ),
          ),
          GoRoute(
            path: '/upload',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: UploadScreen(),
            ),
          ),
          GoRoute(
            path: '/notices',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: NoticesScreen(),
            ),
          ),
          GoRoute(
            path: '/feedback',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: FeedbackScreen(),
            ),
          ),
          GoRoute(
            path: '/more',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: MoreScreen(),
            ),
          ),
        ],
      ),
    ],
  );
}
