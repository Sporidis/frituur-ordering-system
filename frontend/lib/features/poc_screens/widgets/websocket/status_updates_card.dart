import 'package:flutter/material.dart';
import 'package:frituur_ordering_system/features/order/mod.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';

class StatusUpdatesCard extends StatelessWidget {
  final OrderStatusUpdate? latestStatusUpdate;

  const StatusUpdatesCard({super.key, this.latestStatusUpdate});

  Color _getStatusColor(OrderStatus status) {
    switch (status) {
      case OrderStatus.pending:
        return Colors.orange;
      case OrderStatus.inProgress:
        return Colors.blue;
      case OrderStatus.ready:
        return Colors.green;
      case OrderStatus.completed:
        return Colors.grey;
    }
  }

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
              l10n.realTimeStatusUpdates,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            if (latestStatusUpdate != null) ...[
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: _getStatusColor(
                    latestStatusUpdate!.status,
                  ).withValues(alpha: 0.1),
                  border: Border.all(
                    color: _getStatusColor(latestStatusUpdate!.status),
                  ),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${l10n.orderLabel} ${latestStatusUpdate!.orderId}',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    Text(
                      '${l10n.statusLabel} ${latestStatusUpdate!.status.getLocalizedDisplayName(l10n)}',
                    ),
                    if (latestStatusUpdate!.message != null)
                      Text(
                        '${l10n.messageLabel} ${latestStatusUpdate!.getLocalizedMessage(l10n)}',
                      ),
                    Text('${l10n.timeLabel} ${latestStatusUpdate!.timestamp}'),
                  ],
                ),
              ),
            ] else ...[
              Text(
                l10n.noStatusUpdatesYet,
                style: const TextStyle(color: Colors.grey),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
