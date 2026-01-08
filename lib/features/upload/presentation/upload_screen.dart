import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
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
    final spacing = ResponsiveGrid.spacing(context);
    // 태블릿 이상에서 2열 레이아웃 사용
    final useDesktopLayout = Breakpoints.isDesktopOrTablet(context);

    return SafeArea(
      child: SingleChildScrollView(
        padding: padding,
        child: ResponsiveContainer(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(context),
              SizedBox(height: spacing),
              if (useDesktopLayout)
                _buildDesktopLayout(context)
              else
                _buildMobileLayout(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDesktopLayout(BuildContext context) {
    final spacing = ResponsiveGrid.spacing(context);
    final cardPadding = ResponsiveGrid.cardPadding(context);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // 왼쪽: 업로드 영역
        Expanded(
          flex: 3,
          child: Column(
            children: [
              _buildUploadZone(context),
              SizedBox(height: spacing),
              _buildOrDivider(),
              SizedBox(height: spacing),
              _buildManualEntryButton(context),
            ],
          ),
        ),
        SizedBox(width: spacing),
        // 오른쪽: 최근 업로드
        Expanded(
          flex: 2,
          child: Container(
            padding: cardPadding,
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildRecentUploadsHeader(context),
                SizedBox(height: spacing * 0.75),
                _buildRecentUploadsList(context),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildMobileLayout(BuildContext context) {
    final spacing = ResponsiveGrid.spacing(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildUploadZone(context),
        SizedBox(height: spacing),
        _buildOrDivider(),
        SizedBox(height: spacing),
        _buildManualEntryButton(context),
        SizedBox(height: spacing * 1.5),
        _buildRecentUploadsHeader(context),
        SizedBox(height: spacing * 0.75),
        _buildRecentUploadsList(context),
      ],
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Upload Session', style: TextStyle(fontSize: ResponsiveText.headlineSize(context), fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
        const SizedBox(height: 4),
        Text('Add your poker session results', style: TextStyle(fontSize: ResponsiveText.bodySize(context), color: AppColors.textSecondary)),
      ],
    );
  }

  Widget _buildUploadZone(BuildContext context) {
    // PC에서 업로드 존 패딩 증가
    final zonePadding = ResponsiveValue.of<double>(context, mobile: 40, tablet: 50, desktop: 60, largeDesktop: 80);
    final iconSize = ResponsiveValue.of<double>(context, mobile: 48, tablet: 56, desktop: 64, largeDesktop: 72);

    return MouseRegion(
      onEnter: (_) => setState(() => _isDragging = true),
      onExit: (_) => setState(() => _isDragging = false),
      child: GestureDetector(
        onTap: () {},
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: EdgeInsets.all(zonePadding),
          decoration: BoxDecoration(
            color: _isDragging ? AppColors.profit.withValues(alpha: 0.1) : AppColors.card,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: _isDragging ? AppColors.profit : AppColors.border, width: _isDragging ? 2 : 1),
          ),
          child: Column(
            children: [
              Container(
                padding: EdgeInsets.all(iconSize * 0.4),
                decoration: BoxDecoration(color: AppColors.profit.withValues(alpha: 0.15), shape: BoxShape.circle),
                child: Icon(Icons.cloud_upload_outlined, size: iconSize, color: AppColors.profit),
              ),
              SizedBox(height: ResponsiveGrid.spacing(context)),
              Text('Upload Screenshot', style: TextStyle(fontSize: ResponsiveText.titleSize(context), fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
              const SizedBox(height: 8),
              Text('Drag & drop or click to browse', style: TextStyle(fontSize: ResponsiveText.bodySize(context), color: AppColors.textSecondary)),
              SizedBox(height: ResponsiveGrid.spacing(context) * 0.75),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(6)),
                child: Text('PNG, JPG up to 10MB', style: TextStyle(fontSize: ResponsiveText.captionSize(context), color: AppColors.textMuted)),
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

  Widget _buildManualEntryButton(BuildContext context) {
    final cardPadding = ResponsiveGrid.cardPadding(context);

    return GestureDetector(
      onTap: () => context.push('/upload/manual'),
      child: Container(
        width: double.infinity,
        padding: cardPadding,
        decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.border)),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: AppColors.promotion.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(10)),
              child: const Icon(Icons.edit_note, color: AppColors.promotion, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Manual Entry', style: TextStyle(fontSize: ResponsiveText.titleSize(context), fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                  const SizedBox(height: 4),
                  Text('Enter session details manually', style: TextStyle(fontSize: ResponsiveText.bodySize(context), color: AppColors.textSecondary)),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios, color: AppColors.textMuted, size: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentUploadsHeader(BuildContext context) {
    return Text('Recent Uploads', style: TextStyle(fontSize: ResponsiveText.titleSize(context), fontWeight: FontWeight.w600, color: AppColors.textPrimary));
  }

  Widget _buildRecentUploadsList(BuildContext context) {
    final uploads = [
      _UploadData(fileName: 'pokerstars_session_01.png', date: 'Jan 7, 2026 • 2:34 PM', status: UploadStatus.processed, extractedAmount: 850),
      _UploadData(fileName: 'ggpoker_results.jpg', date: 'Jan 6, 2026 • 11:20 PM', status: UploadStatus.processed, extractedAmount: -320),
      _UploadData(fileName: 'session_screenshot.png', date: 'Jan 5, 2026 • 8:45 PM', status: UploadStatus.processing),
    ];
    return Column(children: uploads.map((upload) => _buildUploadCard(upload, context)).toList());
  }

  Widget _buildUploadCard(_UploadData upload, BuildContext context) {
    final cardPadding = ResponsiveGrid.cardPadding(context);

    return Container(
      margin: EdgeInsets.only(bottom: ResponsiveGrid.spacing(context) * 0.5),
      padding: cardPadding,
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
                Text(upload.fileName, style: TextStyle(fontSize: ResponsiveText.bodySize(context), fontWeight: FontWeight.w500, color: AppColors.textPrimary), overflow: TextOverflow.ellipsis),
                const SizedBox(height: 4),
                Text(upload.date, style: TextStyle(fontSize: ResponsiveText.captionSize(context), color: AppColors.textMuted)),
              ],
            ),
          ),
          _buildStatusBadge(upload, context),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(_UploadData upload, BuildContext context) {
    if (upload.status == UploadStatus.processing) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(color: AppColors.promotion.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(6)),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(width: 12, height: 12, child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.promotion)),
            const SizedBox(width: 6),
            Text('Processing', style: TextStyle(fontSize: ResponsiveText.captionSize(context), fontWeight: FontWeight.w500, color: AppColors.promotion)),
          ],
        ),
      );
    }
    final amount = upload.extractedAmount ?? 0;
    final isProfit = amount >= 0;
    final color = isProfit ? AppColors.profit : AppColors.loss;
    final text = isProfit ? '+\$$amount' : '-\$${amount.abs()}';
    return Text(text, style: TextStyle(fontSize: ResponsiveText.bodySize(context) + 1, fontWeight: FontWeight.bold, color: color));
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
