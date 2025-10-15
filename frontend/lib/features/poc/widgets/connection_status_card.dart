import 'package:flutter/material.dart';
import 'package:frituur_ordering_system/shared/mod.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';

class ConnectionStatusCard extends StatelessWidget {
  final WebSocketService websocketService;

  const ConnectionStatusCard({super.key, required this.websocketService});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Icon(
              websocketService.isConnected ? Icons.wifi : Icons.wifi_off,
              color: websocketService.isConnected ? Colors.green : Colors.red,
            ),
            const SizedBox(width: 8),
            Text(
              websocketService.isConnected
                  ? l10n.connectedToBackend
                  : l10n.disconnected,
              style: TextStyle(
                color: websocketService.isConnected ? Colors.green : Colors.red,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
