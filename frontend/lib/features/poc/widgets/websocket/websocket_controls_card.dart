import 'package:flutter/material.dart';
import 'package:frituur_ordering_system/shared/mod.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';

class WebSocketControlsCard extends StatelessWidget {
  final WebSocketService websocketService;

  const WebSocketControlsCard({super.key, required this.websocketService});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              l10n.websocketControls,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: websocketService.isConnected
                        ? null
                        : () => websocketService.connect(),
                    icon: const Icon(Icons.link),
                    label: Text(l10n.connect),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: websocketService.isConnected
                        ? () => websocketService.disconnect()
                        : null,
                    icon: const Icon(Icons.link_off),
                    label: Text(l10n.disconnect),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
