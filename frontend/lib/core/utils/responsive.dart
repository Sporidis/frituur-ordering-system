import 'package:flutter/material.dart';

/// Responsive design utilities for mobile and web-friendly layouts
class Responsive {
  static const double maxContentWidth =
      800.0; // Maximum width for content on large screens

  static bool isMobile(BuildContext context) {
    return MediaQuery.of(context).size.width < 600;
  }

  static bool isTablet(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    return width >= 600 && width < 1024;
  }

  static bool isDesktop(BuildContext context) {
    return MediaQuery.of(context).size.width >= 1024;
  }

  static bool isLargeScreen(BuildContext context) {
    return MediaQuery.of(context).size.width > maxContentWidth;
  }

  static double getResponsivePadding(BuildContext context) {
    if (isMobile(context)) return 8.0;
    if (isTablet(context)) return 12.0;
    return 16.0;
  }

  static double getResponsiveSpacing(BuildContext context) {
    if (isMobile(context)) return 8.0;
    if (isTablet(context)) return 12.0;
    return 16.0;
  }

  static double getResponsiveFontSize(
    BuildContext context, {
    required double mobile,
    required double tablet,
    required double desktop,
  }) {
    if (isMobile(context)) return mobile;
    if (isTablet(context)) return tablet;
    return desktop;
  }

  static EdgeInsets getResponsiveCardPadding(BuildContext context) {
    final padding = getResponsivePadding(context);
    return EdgeInsets.all(padding);
  }

  static EdgeInsets getResponsiveCardMargin(BuildContext context) {
    final margin = getResponsivePadding(context) * 0.5;
    return EdgeInsets.symmetric(horizontal: margin, vertical: margin * 0.5);
  }

  static double getResponsiveButtonHeight(BuildContext context) {
    if (isMobile(context)) return 40.0;
    if (isTablet(context)) return 44.0;
    return 48.0;
  }

  static EdgeInsets getResponsiveButtonPadding(BuildContext context) {
    if (isMobile(context)) {
      return const EdgeInsets.symmetric(horizontal: 12, vertical: 8);
    }
    if (isTablet(context)) {
      return const EdgeInsets.symmetric(horizontal: 16, vertical: 10);
    }
    return const EdgeInsets.symmetric(horizontal: 20, vertical: 12);
  }

  static double getResponsiveIconSize(BuildContext context) {
    if (isMobile(context)) return 18.0;
    if (isTablet(context)) return 20.0;
    return 22.0;
  }

  /// Get the effective content width, constrained by maxContentWidth
  static double getContentWidth(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    return screenWidth > maxContentWidth ? maxContentWidth : screenWidth;
  }
}

/// Responsive button widget that adapts to screen size
class ResponsiveButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final IconData? icon;
  final String label;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final bool isLoading;
  final bool isFullWidth;

  const ResponsiveButton({
    super.key,
    required this.onPressed,
    this.icon,
    required this.label,
    this.backgroundColor,
    this.foregroundColor,
    this.isLoading = false,
    this.isFullWidth = false,
  });

  @override
  Widget build(BuildContext context) {
    Widget button = ElevatedButton.icon(
      onPressed: onPressed,
      icon: isLoading
          ? SizedBox(
              width: Responsive.getResponsiveIconSize(context),
              height: Responsive.getResponsiveIconSize(context),
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: foregroundColor ?? Colors.white,
              ),
            )
          : icon != null
          ? Icon(icon, size: Responsive.getResponsiveIconSize(context))
          : const SizedBox.shrink(),
      label: Text(
        label,
        style: TextStyle(
          fontSize: Responsive.getResponsiveFontSize(
            context,
            mobile: 12,
            tablet: 14,
            desktop: 14,
          ),
        ),
      ),
      style: ElevatedButton.styleFrom(
        backgroundColor: backgroundColor,
        foregroundColor: foregroundColor,
        padding: Responsive.getResponsiveButtonPadding(context),
        minimumSize: Size(
          isFullWidth ? double.infinity : 0,
          Responsive.getResponsiveButtonHeight(context),
        ),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );

    return button;
  }
}

/// Responsive container that centers content with max width on large screens
class ResponsiveContainer extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;
  final EdgeInsets? margin;
  final double? maxWidth;

  const ResponsiveContainer({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.maxWidth,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveMaxWidth = maxWidth ?? Responsive.maxContentWidth;
    final isLargeScreen = Responsive.isLargeScreen(context);

    Widget content = child;

    if (padding != null) {
      content = Padding(padding: padding!, child: content);
    }

    if (isLargeScreen) {
      content = Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: effectiveMaxWidth),
          child: content,
        ),
      );
    }

    if (margin != null) {
      content = Padding(padding: margin!, child: content);
    }

    return content;
  }
}

/// Responsive card widget with consistent spacing
class ResponsiveCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;
  final EdgeInsets? margin;

  const ResponsiveCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
  });

  @override
  Widget build(BuildContext context) {
    final isLargeScreen = Responsive.isLargeScreen(context);

    Widget card = Card(
      margin: margin ?? Responsive.getResponsiveCardMargin(context),
      child: Padding(
        padding: padding ?? Responsive.getResponsiveCardPadding(context),
        child: child,
      ),
    );

    // On large screens, constrain the card width
    if (isLargeScreen) {
      card = Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: Responsive.maxContentWidth),
          child: card,
        ),
      );
    }

    return card;
  }
}

/// Responsive text widget with adaptive font sizes
class ResponsiveText extends StatelessWidget {
  final String text;
  final FontWeight? fontWeight;
  final Color? color;
  final TextAlign? textAlign;
  final bool isTitle;
  final bool isSubtitle;

  const ResponsiveText(
    this.text, {
    super.key,
    this.fontWeight,
    this.color,
    this.textAlign,
    this.isTitle = false,
    this.isSubtitle = false,
  });

  @override
  Widget build(BuildContext context) {
    double fontSize;

    if (isTitle) {
      fontSize = Responsive.getResponsiveFontSize(
        context,
        mobile: 16,
        tablet: 18,
        desktop: 20,
      );
    } else if (isSubtitle) {
      fontSize = Responsive.getResponsiveFontSize(
        context,
        mobile: 14,
        tablet: 16,
        desktop: 16,
      );
    } else {
      fontSize = Responsive.getResponsiveFontSize(
        context,
        mobile: 12,
        tablet: 14,
        desktop: 14,
      );
    }

    return Text(
      text,
      style: TextStyle(
        fontSize: fontSize,
        fontWeight: fontWeight,
        color: color,
      ),
      textAlign: textAlign,
    );
  }
}

/// Responsive row that stacks on mobile
class ResponsiveRow extends StatelessWidget {
  final List<Widget> children;
  final double spacing;
  final MainAxisAlignment mainAxisAlignment;
  final CrossAxisAlignment crossAxisAlignment;

  const ResponsiveRow({
    super.key,
    required this.children,
    this.spacing = 8.0,
    this.mainAxisAlignment = MainAxisAlignment.start,
    this.crossAxisAlignment = CrossAxisAlignment.center,
  });

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);

    if (isMobile) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: children
            .map(
              (child) => Padding(
                padding: EdgeInsets.only(bottom: spacing),
                child: child,
              ),
            )
            .toList(),
      );
    }

    return Row(
      mainAxisAlignment: mainAxisAlignment,
      crossAxisAlignment: crossAxisAlignment,
      children: children
          .map(
            (child) => Expanded(
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: spacing / 2),
                child: child,
              ),
            ),
          )
          .toList(),
    );
  }
}

/// Responsive info card for displaying data
class ResponsiveInfoCard extends StatelessWidget {
  final String title;
  final String content;
  final Color color;
  final IconData? icon;

  const ResponsiveInfoCard({
    super.key,
    required this.title,
    required this.content,
    required this.color,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: Responsive.getResponsiveCardPadding(context),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        border: Border.all(color: color.withValues(alpha: 0.2)),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              if (icon != null) ...[
                Icon(icon, size: Responsive.getResponsiveIconSize(context)),
                const SizedBox(width: 4),
              ],
              ResponsiveText(
                title,
                fontWeight: FontWeight.bold,
                isSubtitle: true,
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            content,
            style: TextStyle(
              fontSize: Responsive.getResponsiveFontSize(
                context,
                mobile: 10,
                tablet: 11,
                desktop: 12,
              ),
              fontFamily: 'monospace',
            ),
          ),
        ],
      ),
    );
  }
}
