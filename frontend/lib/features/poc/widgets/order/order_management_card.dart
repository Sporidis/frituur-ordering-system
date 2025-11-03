import 'package:flutter/material.dart';
import 'package:frituur_ordering_system/features/websocket/presentation/websocket_view_model.dart';
import 'package:frituur_ordering_system/shared/mod.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';

class OrderManagementCard extends StatefulWidget {
  final WebSocketViewModel webSocketViewModel;
  final VoidCallback onCreateOrder;
  final VoidCallback onCreateSampleOrders;

  const OrderManagementCard({
    super.key,
    required this.webSocketViewModel,
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

    return ResponsiveCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ResponsiveText(
            l10n.orderManagement,
            fontWeight: FontWeight.bold,
            isTitle: true,
          ),
          SizedBox(height: Responsive.getResponsiveSpacing(context)),

          // Customer name input
          TextField(
            controller: _customerNameController,
            decoration: InputDecoration(
              labelText: l10n.customerName,
              border: const OutlineInputBorder(),
            ),
          ),
          SizedBox(height: Responsive.getResponsiveSpacing(context)),

          // Create order button
          ResponsiveButton(
            onPressed: widget.onCreateOrder,
            icon: Icons.add_shopping_cart,
            label: l10n.createSampleOrder,
            backgroundColor: Colors.orange,
            foregroundColor: Colors.white,
            isFullWidth: true,
          ),
          SizedBox(height: Responsive.getResponsiveSpacing(context) * 0.5),

          // Create multiple orders button
          ResponsiveButton(
            onPressed: widget.onCreateSampleOrders,
            icon: Icons.add_box,
            label: l10n.createMultipleSampleOrders,
            backgroundColor: Colors.blue,
            foregroundColor: Colors.white,
            isFullWidth: true,
          ),
          SizedBox(height: Responsive.getResponsiveSpacing(context)),

          // Order selection
          if (widget.webSocketViewModel.orders.isNotEmpty) ...[
            ResponsiveText(
              l10n.selectOrderToTrack,
              fontWeight: FontWeight.bold,
              isSubtitle: true,
            ),
            SizedBox(height: Responsive.getResponsiveSpacing(context) * 0.5),
            DropdownButtonFormField<String>(
              initialValue: _selectedOrderId,
              decoration: InputDecoration(
                border: const OutlineInputBorder(),
                labelText: l10n.chooseAnOrder,
              ),
              items: widget.webSocketViewModel.orders.map((order) {
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
            SizedBox(height: Responsive.getResponsiveSpacing(context)),

            // Join/Leave room buttons
            ResponsiveRow(
              children: [
                ResponsiveButton(
                  onPressed:
                      _selectedOrderId != null &&
                          widget.webSocketViewModel.isConnected
                      ? () => widget.webSocketViewModel.joinOrderRoom(
                          _selectedOrderId!,
                        )
                      : null,
                  icon: Icons.login,
                  label: l10n.joinOrderRoom,
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  isFullWidth: true,
                ),
                ResponsiveButton(
                  onPressed:
                      _selectedOrderId != null &&
                          widget.webSocketViewModel.isConnected
                      ? () => widget.webSocketViewModel.leaveOrderRoom(
                          _selectedOrderId!,
                        )
                      : null,
                  icon: Icons.logout,
                  label: l10n.leaveOrderRoom,
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                  isFullWidth: true,
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
