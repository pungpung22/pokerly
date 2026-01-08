import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/layout/responsive_layout.dart';
import '../../../shared/models/session.dart';
import '../../dashboard/providers/dashboard_provider.dart';

class ManualEntryScreen extends ConsumerStatefulWidget {
  const ManualEntryScreen({super.key});

  @override
  ConsumerState<ManualEntryScreen> createState() => _ManualEntryScreenState();
}

class _ManualEntryScreenState extends ConsumerState<ManualEntryScreen> {
  final _formKey = GlobalKey<FormState>();

  DateTime _selectedDate = DateTime.now();
  String _venue = 'PokerStars';
  String _gameType = 'NL Hold\'em';
  String _stakes = '\$1/\$2';
  int _hours = 2;
  int _minutes = 0;
  double _buyIn = 200;
  double _cashOut = 0;
  String _notes = '';
  bool _isLoading = false;

  final List<String> _venues = ['PokerStars', 'GGPoker', 'Local Casino', 'Home Game', 'WPT', 'Other'];
  final List<String> _gameTypes = ['NL Hold\'em', 'PLO', 'Tournament', 'Mixed Games'];
  final List<String> _stakesOptions = ['\$0.5/\$1', '\$1/\$2', '\$2/\$5', '\$5/\$10', 'Tournament'];

  @override
  Widget build(BuildContext context) {
    final padding = ResponsiveGrid.padding(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textPrimary),
          onPressed: () => context.pop(),
        ),
        title: const Text('Record Session', style: TextStyle(color: AppColors.textPrimary)),
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: padding,
          child: ResponsiveContainer(
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildDateSelector(),
                  const SizedBox(height: 16),
                  _buildDropdownField('Venue', _venue, _venues, (v) => setState(() => _venue = v!)),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(child: _buildDropdownField('Game Type', _gameType, _gameTypes, (v) => setState(() => _gameType = v!))),
                      const SizedBox(width: 12),
                      Expanded(child: _buildDropdownField('Stakes', _stakes, _stakesOptions, (v) => setState(() => _stakes = v!))),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildDurationSelector(),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(child: _buildNumberField('Buy-in', _buyIn, (v) => setState(() => _buyIn = v))),
                      const SizedBox(width: 12),
                      Expanded(child: _buildNumberField('Cash-out', _cashOut, (v) => setState(() => _cashOut = v))),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildProfitPreview(),
                  const SizedBox(height: 16),
                  _buildNotesField(),
                  const SizedBox(height: 24),
                  _buildSubmitButton(),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDateSelector() {
    return GestureDetector(
      onTap: _selectDate,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.card,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.profit.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.calendar_today, color: AppColors.profit, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Date', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  const SizedBox(height: 4),
                  Text(_formatDate(_selectedDate), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500, color: AppColors.textPrimary)),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: AppColors.textMuted),
          ],
        ),
      ),
    );
  }

  Future<void> _selectDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: const ColorScheme.dark(
            primary: AppColors.profit,
            surface: AppColors.card,
          ),
        ),
        child: child!,
      ),
    );
    if (picked != null) setState(() => _selectedDate = picked);
  }

  Widget _buildDropdownField(String label, String value, List<String> items, ValueChanged<String?> onChanged) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
          DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: value,
              isExpanded: true,
              dropdownColor: AppColors.card,
              style: const TextStyle(fontSize: 16, color: AppColors.textPrimary),
              items: items.map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
              onChanged: onChanged,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDurationSelector() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Duration', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: Row(
                  children: [
                    IconButton(
                      onPressed: () => setState(() => _hours = (_hours - 1).clamp(0, 24)),
                      icon: const Icon(Icons.remove_circle_outline, color: AppColors.textMuted),
                    ),
                    Expanded(
                      child: Text('${_hours}h', textAlign: TextAlign.center, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                    ),
                    IconButton(
                      onPressed: () => setState(() => _hours = (_hours + 1).clamp(0, 24)),
                      icon: const Icon(Icons.add_circle_outline, color: AppColors.profit),
                    ),
                  ],
                ),
              ),
              Container(width: 1, height: 40, color: AppColors.border),
              Expanded(
                child: Row(
                  children: [
                    IconButton(
                      onPressed: () => setState(() => _minutes = (_minutes - 15).clamp(0, 45)),
                      icon: const Icon(Icons.remove_circle_outline, color: AppColors.textMuted),
                    ),
                    Expanded(
                      child: Text('${_minutes}m', textAlign: TextAlign.center, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                    ),
                    IconButton(
                      onPressed: () => setState(() => _minutes = (_minutes + 15).clamp(0, 45)),
                      icon: const Icon(Icons.add_circle_outline, color: AppColors.profit),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildNumberField(String label, double value, ValueChanged<double> onChanged) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
          const SizedBox(height: 4),
          TextFormField(
            initialValue: value.toStringAsFixed(0),
            keyboardType: TextInputType.number,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
            decoration: const InputDecoration(
              prefixText: '\$ ',
              prefixStyle: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: AppColors.textMuted),
              border: InputBorder.none,
              isDense: true,
              contentPadding: EdgeInsets.zero,
            ),
            onChanged: (v) => onChanged(double.tryParse(v) ?? 0),
          ),
        ],
      ),
    );
  }

  Widget _buildProfitPreview() {
    final profit = _cashOut - _buyIn;
    final isProfit = profit >= 0;
    final color = isProfit ? AppColors.profit : AppColors.loss;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [color.withValues(alpha: 0.2), color.withValues(alpha: 0.05)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text('Profit/Loss', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
          Text(
            '${isProfit ? '+' : ''}\$${profit.toStringAsFixed(0)}',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: color),
          ),
        ],
      ),
    );
  }

  Widget _buildNotesField() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Notes (optional)', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
          const SizedBox(height: 8),
          TextFormField(
            maxLines: 3,
            style: const TextStyle(color: AppColors.textPrimary),
            decoration: const InputDecoration(
              hintText: 'Add any notes about this session...',
              hintStyle: TextStyle(color: AppColors.textMuted),
              border: InputBorder.none,
              isDense: true,
              contentPadding: EdgeInsets.zero,
            ),
            onChanged: (v) => _notes = v,
          ),
        ],
      ),
    );
  }

  Widget _buildSubmitButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _isLoading ? null : _submitSession,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.profit,
          foregroundColor: Colors.black,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
        child: _isLoading
            ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black))
            : const Text('Save Session', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
      ),
    );
  }

  Future<void> _submitSession() async {
    setState(() => _isLoading = true);

    final session = Session(
      id: '',
      date: _selectedDate,
      venue: _venue,
      gameType: _gameType,
      stakes: _stakes,
      durationMinutes: _hours * 60 + _minutes,
      buyIn: _buyIn,
      cashOut: _cashOut,
      notes: _notes.isEmpty ? null : _notes,
    );

    final success = await ref.read(sessionNotifierProvider.notifier).addSession(session);

    setState(() => _isLoading = false);

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Session recorded successfully!'),
          backgroundColor: AppColors.profit,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      );
      context.go('/');
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Failed to save session. Please try again.'),
          backgroundColor: AppColors.loss,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      );
    }
  }

  String _formatDate(DateTime date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return '${months[date.month - 1]} ${date.day}, ${date.year}';
  }
}
