import 'package:flutter/material.dart';
import 'package:frituur_ordering_system/shared/mod.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';

class OrderManagementCard extends StatefulWidget {
  final WebSocketService websocketService;
  final VoidCallback onCreateOrder;
  final VoidCallback onCreateSampleOrders;

  const OrderManagementCard({
    super.key,
    required this.websocketService,
    required this.onCreateOrder,
    required this.onCreateSampleOrders,
  });

  @override
  State<OrderManagementCard> createState() => _OrderManagementCardState();
}

class _OrderManagementCardState extends State<OrderManagementCard> {
  final TextEditingController _customerNameController = TextEditingController();
  String? _selectedOrderId;

  @override
  void initState() {
    super.initState();
    _customerNameController.text = AppConstants.defaultCustomerName;
  }

  @override
  void dispose() {
    _customerNameController.dispose();
    super.dispose();
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
              l10n.orderManagement,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),

            // Customer name input
            TextField(
              controller: _customerNameController,
              decoration: InputDecoration(
                labelText: l10n.customerName,
                border: const OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),

            // Create order button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: widget.onCreateOrder,
                icon: const Icon(Icons.add_shopping_cart),
                label: Text(l10n.createSampleOrder),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.orange,
                  foregroundColor: Colors.white,
                ),
              ),
            ),
            const SizedBox(height: 8),

            // Create multiple orders button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: widget.onCreateSampleOrders,
                icon: const Icon(Icons.add_box),
                label: Text(l10n.createMultipleSampleOrders),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Order selection
            if (widget.websocketService.orders.isNotEmpty) ...[
              Text(
                l10n.selectOrderToTrack,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                value: _selectedOrderId,
                decoration: InputDecoration(
                  border: const OutlineInputBorder(),
                  labelText: l10n.chooseAnOrder,
                ),
                items: widget.websocketService.orders.map((order) {
                  return DropdownMenuItem<String>(
                    value: order.id,
                    child: Text(
                      '${order.id} - ${order.customerName} (${order.status.getLocalizedDisplayName(l10n)})',
                    ),
                  );
                }).toList(),
                onChanged: (String? orderId) {
                  setState(() {
                    _selectedOrderId = orderId;
                  });
                },
              ),
              const SizedBox(height: 16),

              // Join/Leave room buttons
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed:
                          _selectedOrderId != null &&
                              widget.websocketService.isConnected
                          ? () => widget.websocketService.joinOrderRoom(
                              _selectedOrderId!,
                            )
                          : null,
                      icon: const Icon(Icons.login),
                      label: Text(l10n.joinOrderRoom),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed:
                          _selectedOrderId != null &&
                              widget.websocketService.isConnected
                          ? () => widget.websocketService.leaveOrderRoom(
                              _selectedOrderId!,
                            )
                          : null,
                      icon: const Icon(Icons.logout),
                      label: Text(l10n.leaveOrderRoom),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        foregroundColor: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
