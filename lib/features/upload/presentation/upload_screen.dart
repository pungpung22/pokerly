import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/layout/responsive_layout.dart';

class UploadScreen extends StatefulWidget {
  const UploadScreen({super.key});

  @override
  State<UploadScreen> createState() => _UploadScreenState();
}

class _UploadScreenState extends State<UploadScreen> {
  bool _isDragging = false;

  @override
  Widget build(BuildContext context) {
    final padding = ResponsiveGrid.padding(context);
    final isDesktop = Breakpoints.isDesktop(context);

    return SafeArea(
      child: SingleChildScrollView(
        padding: padding,
        child: ResponsiveContainer(
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
        // 왼쪽: 업로드 영역
        Expanded(
          flex: 3,
          child: Column(
            children: [
              _buildUploadZone(),
              const SizedBox(height: 24),
              _buildOrDivider(),
              const SizedBox(height: 24),
              _buildManualEntryButton(),
            ],
          ),
        ),
        const SizedBox(width: 24),
        // 오른쪽: 최근 업로드
        Expanded(
          flex: 2,
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildRecentUploadsHeader(),
                const SizedBox(height: 16),
                _buildRecentUploadsList(),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildMobileLayout() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildUploadZone(),
        const SizedBox(height: 24),
        _buildOrDivider(),
        const SizedBox(height: 24),
        _buildManualEntryButton(),
        const SizedBox(height: 32),
        _buildRecentUploadsHeader(),
        const SizedBox(height: 16),
        _buildRecentUploadsList(),
      ],
    );
  }

  Widget _buildHeader() {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Upload Session', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
        SizedBox(height: 4),
        Text('Add your poker session results', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
      ],
    );
  }

  Widget _buildUploadZone() {
    return MouseRegion(
      onEnter: (_) => setState(() => _isDragging = true),
      onExit: (_) => setState(() => _isDragging = false),
      child: GestureDetector(
        onTap: () {},
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.all(40),
          decoration: BoxDecoration(
            color: _isDragging ? AppColors.profit.withValues(alpha: 0.1) : AppColors.card,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: _isDragging ? AppColors.profit : AppColors.border, width: _isDragging ? 2 : 1),
          ),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(color: AppColors.profit.withValues(alpha: 0.15), shape: BoxShape.circle),
                child: const Icon(Icons.cloud_upload_outlined, size: 48, color: AppColors.profit),
              ),
              const SizedBox(height: 20),
              const Text('Upload Screenshot', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
              const SizedBox(height: 8),
              const Text('Drag & drop or click to browse', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(6)),
                child: const Text('PNG, JPG up to 10MB', style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOrDivider() {
    return const Row(
      children: [
        Expanded(child: Divider(color: AppColors.border)),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text('OR', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
        ),
        Expanded(child: Divider(color: AppColors.border)),
      ],
    );
  }

  Widget _buildManualEntryButton() {
    return GestureDetector(
      onTap: () {},
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: AppColors.promotion.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(10)),
              child: const Icon(Icons.edit_note, color: AppColors.promotion, size: 24),
            ),
            const SizedBox(width: 16),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Manual Entry', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                  SizedBox(height: 4),
                  Text('Enter session details manually', style: TextStyle(fontSize: 13, color: AppColors.textSecondary)),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios, color: AppColors.textMuted, size: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentUploadsHeader() {
    return const Text('Recent Uploads', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: AppColors.textPrimary));
  }

  Widget _buildRecentUploadsList() {
    final uploads = [
      _UploadData(fileName: 'pokerstars_session_01.png', date: 'Jan 7, 2026 • 2:34 PM', status: UploadStatus.processed, extractedAmount: 850),
      _UploadData(fileName: 'ggpoker_results.jpg', date: 'Jan 6, 2026 • 11:20 PM', status: UploadStatus.processed, extractedAmount: -320),
      _UploadData(fileName: 'session_screenshot.png', date: 'Jan 5, 2026 • 8:45 PM', status: UploadStatus.processing),
    ];
    return Column(children: uploads.map((upload) => _buildUploadCard(upload)).toList());
  }

  Widget _buildUploadCard(_UploadData upload) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
      child: Row(
        children: [
          Container(
            width: 48, height: 48,
            decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(8)),
            child: const Icon(Icons.image_outlined, color: AppColors.textSecondary, size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(upload.fileName, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textPrimary), overflow: TextOverflow.ellipsis),
                const SizedBox(height: 4),
                Text(upload.date, style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
              ],
            ),
          ),
          _buildStatusBadge(upload),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(_UploadData upload) {
    if (upload.status == UploadStatus.processing) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(color: AppColors.promotion.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(6)),
        child: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(width: 12, height: 12, child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.promotion)),
            SizedBox(width: 6),
            Text('Processing', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.promotion)),
          ],
        ),
      );
    }
    final amount = upload.extractedAmount ?? 0;
    final isProfit = amount >= 0;
    final color = isProfit ? AppColors.profit : AppColors.loss;
    final text = isProfit ? '+\$${amount}' : '-\$${amount.abs()}';
    return Text(text, style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: color));
  }
}

enum UploadStatus { pending, processing, processed, failed }

class _UploadData {
  final String fileName;
  final String date;
  final UploadStatus status;
  final int? extractedAmount;
  _UploadData({required this.fileName, required this.date, required this.status, this.extractedAmount});
}
