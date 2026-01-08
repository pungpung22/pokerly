import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../shared/models/session.dart';
import '../data/session_repository.dart';

final sessionRepositoryProvider = Provider((ref) => SessionRepository());

final sessionStatsProvider = FutureProvider<SessionStats>((ref) async {
  final repository = ref.watch(sessionRepositoryProvider);
  return repository.getStats();
});

final weeklyDataProvider = FutureProvider<List<double>>((ref) async {
  final repository = ref.watch(sessionRepositoryProvider);
  return repository.getWeeklyData();
});

final allSessionsProvider = FutureProvider<List<Session>>((ref) async {
  final repository = ref.watch(sessionRepositoryProvider);
  return repository.getAllSessions();
});

// Notifier for managing session state with mutations
class SessionNotifier extends StateNotifier<AsyncValue<SessionStats>> {
  final SessionRepository _repository;
  final Ref _ref;

  SessionNotifier(this._repository, this._ref) : super(const AsyncValue.loading()) {
    loadStats();
  }

  Future<void> loadStats() async {
    state = const AsyncValue.loading();
    try {
      final stats = await _repository.getStats();
      state = AsyncValue.data(stats);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<bool> addSession(Session session) async {
    final result = await _repository.createSession(session);
    if (result != null) {
      await loadStats();
      _ref.invalidate(weeklyDataProvider);
      _ref.invalidate(allSessionsProvider);
      return true;
    }
    return false;
  }

  Future<bool> deleteSession(String id) async {
    final result = await _repository.deleteSession(id);
    if (result) {
      await loadStats();
      _ref.invalidate(weeklyDataProvider);
      _ref.invalidate(allSessionsProvider);
      return true;
    }
    return false;
  }
}

final sessionNotifierProvider = StateNotifierProvider<SessionNotifier, AsyncValue<SessionStats>>((ref) {
  final repository = ref.watch(sessionRepositoryProvider);
  return SessionNotifier(repository, ref);
});
