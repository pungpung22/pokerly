import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

class Accordion extends StatefulWidget {
  final String title;
  final Widget content;
  final bool initiallyExpanded;
  final IconData? leadingIcon;
  final Color? headerColor;
  final EdgeInsets? contentPadding;

  const Accordion({
    super.key,
    required this.title,
    required this.content,
    this.initiallyExpanded = false,
    this.leadingIcon,
    this.headerColor,
    this.contentPadding,
  });

  @override
  State<Accordion> createState() => _AccordionState();
}

class _AccordionState extends State<Accordion> with SingleTickerProviderStateMixin {
  late bool _isExpanded;
  late AnimationController _controller;
  late Animation<double> _iconRotation;
  late Animation<double> _heightFactor;

  @override
  void initState() {
    super.initState();
    _isExpanded = widget.initiallyExpanded;
    _controller = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    _iconRotation = Tween<double>(begin: 0.0, end: 0.5).animate(_controller);
    _heightFactor = Tween<double>(begin: 0.0, end: 1.0).animate(_controller);

    if (_isExpanded) {
      _controller.value = 1.0;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _handleTap() {
    setState(() {
      _isExpanded = !_isExpanded;
      if (_isExpanded) {
        _controller.forward();
      } else {
        _controller.reverse();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          GestureDetector(
            onTap: _handleTap,
            behavior: HitTestBehavior.opaque,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: widget.headerColor,
                borderRadius: _isExpanded
                    ? const BorderRadius.only(
                        topLeft: Radius.circular(12),
                        topRight: Radius.circular(12),
                      )
                    : BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  if (widget.leadingIcon != null) ...[
                    Icon(
                      widget.leadingIcon,
                      size: 20,
                      color: AppColors.textSecondary,
                    ),
                    const SizedBox(width: 12),
                  ],
                  Expanded(
                    child: Text(
                      widget.title,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ),
                  RotationTransition(
                    turns: _iconRotation,
                    child: const Icon(
                      Icons.keyboard_arrow_down,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            ),
          ),
          ClipRect(
            child: AnimatedBuilder(
              animation: _controller,
              builder: (context, child) {
                return Align(
                  heightFactor: _heightFactor.value,
                  child: child,
                );
              },
              child: Container(
                width: double.infinity,
                padding: widget.contentPadding ?? const EdgeInsets.all(16),
                decoration: const BoxDecoration(
                  border: Border(top: BorderSide(color: AppColors.divider)),
                ),
                child: widget.content,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class AccordionGroup extends StatefulWidget {
  final List<AccordionItem> items;
  final bool allowMultiple;

  const AccordionGroup({
    super.key,
    required this.items,
    this.allowMultiple = false,
  });

  @override
  State<AccordionGroup> createState() => _AccordionGroupState();
}

class _AccordionGroupState extends State<AccordionGroup> {
  late Set<int> _expandedIndices;

  @override
  void initState() {
    super.initState();
    _expandedIndices = {};
    for (int i = 0; i < widget.items.length; i++) {
      if (widget.items[i].initiallyExpanded) {
        _expandedIndices.add(i);
      }
    }
  }

  void _handleItemTap(int index) {
    setState(() {
      if (_expandedIndices.contains(index)) {
        _expandedIndices.remove(index);
      } else {
        if (!widget.allowMultiple) {
          _expandedIndices.clear();
        }
        _expandedIndices.add(index);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: widget.items.asMap().entries.map((entry) {
          final index = entry.key;
          final item = entry.value;
          final isExpanded = _expandedIndices.contains(index);
          final isLast = index == widget.items.length - 1;

          return _AccordionGroupItem(
            item: item,
            isExpanded: isExpanded,
            isLast: isLast,
            onTap: () => _handleItemTap(index),
          );
        }).toList(),
      ),
    );
  }
}

class _AccordionGroupItem extends StatefulWidget {
  final AccordionItem item;
  final bool isExpanded;
  final bool isLast;
  final VoidCallback onTap;

  const _AccordionGroupItem({
    required this.item,
    required this.isExpanded,
    required this.isLast,
    required this.onTap,
  });

  @override
  State<_AccordionGroupItem> createState() => _AccordionGroupItemState();
}

class _AccordionGroupItemState extends State<_AccordionGroupItem>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _iconRotation;
  late Animation<double> _heightFactor;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    _iconRotation = Tween<double>(begin: 0.0, end: 0.5).animate(_controller);
    _heightFactor = Tween<double>(begin: 0.0, end: 1.0).animate(_controller);

    if (widget.isExpanded) {
      _controller.value = 1.0;
    }
  }

  @override
  void didUpdateWidget(_AccordionGroupItem oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isExpanded != oldWidget.isExpanded) {
      if (widget.isExpanded) {
        _controller.forward();
      } else {
        _controller.reverse();
      }
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        GestureDetector(
          onTap: widget.onTap,
          behavior: HitTestBehavior.opaque,
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              border: widget.isLast && !widget.isExpanded
                  ? null
                  : const Border(bottom: BorderSide(color: AppColors.divider)),
            ),
            child: Row(
              children: [
                if (widget.item.icon != null) ...[
                  Icon(
                    widget.item.icon,
                    size: 20,
                    color: AppColors.textSecondary,
                  ),
                  const SizedBox(width: 12),
                ],
                Expanded(
                  child: Text(
                    widget.item.title,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ),
                RotationTransition(
                  turns: _iconRotation,
                  child: const Icon(
                    Icons.keyboard_arrow_down,
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
          ),
        ),
        ClipRect(
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              return Align(
                heightFactor: _heightFactor.value,
                child: child,
              );
            },
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: widget.item.content,
            ),
          ),
        ),
      ],
    );
  }
}

class AccordionItem {
  final String title;
  final Widget content;
  final IconData? icon;
  final bool initiallyExpanded;

  const AccordionItem({
    required this.title,
    required this.content,
    this.icon,
    this.initiallyExpanded = false,
  });
}
