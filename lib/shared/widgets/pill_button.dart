import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

class PillButton extends StatelessWidget {
  final String label;
  final bool isActive;
  final VoidCallback onTap;
  final Color? activeColor;
  final Color? inactiveColor;

  const PillButton({
    super.key,
    required this.label,
    required this.isActive,
    required this.onTap,
    this.activeColor,
    this.inactiveColor,
  });

  @override
  Widget build(BuildContext context) {
    final bgColor = isActive
        ? (activeColor ?? AppColors.profit)
        : (inactiveColor ?? AppColors.card);
    final textColor = isActive ? AppColors.background : AppColors.textSecondary;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(20),
          border: isActive ? null : Border.all(color: AppColors.border),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 14,
            fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
            color: textColor,
          ),
        ),
      ),
    );
  }
}

class PillButtonGroup extends StatelessWidget {
  final List<String> labels;
  final int selectedIndex;
  final ValueChanged<int> onSelected;
  final Color? activeColor;
  final bool expanded;

  const PillButtonGroup({
    super.key,
    required this.labels,
    required this.selectedIndex,
    required this.onSelected,
    this.activeColor,
    this.expanded = false,
  });

  @override
  Widget build(BuildContext context) {
    if (expanded) {
      return Container(
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: AppColors.card,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: labels.asMap().entries.map((entry) {
            final index = entry.key;
            final label = entry.value;
            final isActive = index == selectedIndex;
            return Expanded(
              child: GestureDetector(
                onTap: () => onSelected(index),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    color: isActive ? (activeColor ?? AppColors.profit) : Colors.transparent,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    label,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: isActive ? AppColors.background : AppColors.textSecondary,
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      );
    }

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: labels.asMap().entries.map((entry) {
        final index = entry.key;
        final label = entry.value;
        return PillButton(
          label: label,
          isActive: index == selectedIndex,
          onTap: () => onSelected(index),
          activeColor: activeColor,
        );
      }).toList(),
    );
  }
}
