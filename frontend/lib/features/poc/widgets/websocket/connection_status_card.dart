import 'package:flutter/material.dart';
import 'package:frituur_ordering_system/shared/mod.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';
import 'package:frituur_ordering_system/features/websocket/presentation/websocket_view_model.dart';

class ConnectionStatusCard extends StatelessWidget {
  final WebSocketViewModel webSocketViewModel;

  const ConnectionStatusCard({super.key, required this.webSocketViewModel});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return ResponsiveCard(
      child: Row(
        children: [
          Icon(
            webSocketViewModel.isConnected ? Icons.wifi : Icons.wifi_off,
            color: webSocketViewModel.isConnected ? Colors.green : Colors.red,
            size: Responsive.getResponsiveIconSize(context),
          ),
          SizedBox(width: Responsive.getResponsiveSpacing(context) * 0.5),
          ResponsiveText(
            webSocketViewModel.isConnected
                ? l10n.connectedToBackend
                : l10n.disconnected,
            color: webSocketViewModel.isConnected ? Colors.green : Colors.red,
            fontWeight: FontWeight.bold,
            isSubtitle: true,
          ),
        ],
      ),
    );
  }
}
