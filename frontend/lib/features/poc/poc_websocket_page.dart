import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';

import '../../shared/mod.dart';
import 'widgets/mod.dart';

class PocWebSocketPage extends StatefulWidget {
  const PocWebSocketPage({super.key});

  @override
  State<PocWebSocketPage> createState() => _PocWebSocketPageState();
}

class _PocWebSocketPageState extends State<PocWebSocketPage> {
  OrderStatusUpdate? _latestStatusUpdate;

  @override
  void initState() {
    super.initState();

    // Listen to order status updates
    context.read<WebSocketService>().orderStatusStream.listen((update) {
      if (mounted) {
        setState(() {
          _latestStatusUpdate = update;
        });

        _showStatusUpdateSnackbar(update);
      }
    });
  }

  void _showStatusUpdateSnackbar(OrderStatusUpdate update) {
    final l10n = AppLocalizations.of(context)!;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          l10n.orderStatusUpdate(
            update.orderId,
            update.status.getLocalizedDisplayName(l10n),
          ),
        ),
        backgroundColor: _getStatusColor(update.status),
        duration: AppConstants.snackbarDuration,
      ),
    );
  }

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

  void _showSuccessSnackbar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
        duration: AppConstants.snackbarDuration,
      ),
    );
  }

  void _showErrorSnackbar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        duration: AppConstants.snackbarDuration,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final languageProvider = Provider.of<LanguageProvider>(context);
    final websocketService = Provider.of<WebSocketService>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('${l10n.appTitle} - WebSocket PoC'),
        backgroundColor: Colors.orange,
        foregroundColor: Colors.white,
        actions: [
          // Language toggle
          PopupMenuButton<String>(
            icon: const Icon(Icons.language),
            onSelected: (String languageCode) {
              if (languageCode == 'en') {
                languageProvider.setLocale(const Locale('en', ''));
              } else {
                languageProvider.setLocale(const Locale('nl', ''));
              }
            },
            itemBuilder: (BuildContext context) => [
              PopupMenuItem<String>(
                value: 'en',
                child: Row(
                  children: [
                    const Icon(Icons.flag, color: Colors.blue),
                    const SizedBox(width: 8),
                    Text(l10n.english),
                  ],
                ),
              ),
              PopupMenuItem<String>(
                value: 'nl',
                child: Row(
                  children: [
                    const Icon(Icons.flag, color: Colors.red),
                    const SizedBox(width: 8),
                    Text(l10n.dutch),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Connection Status
            ConnectionStatusCard(websocketService: websocketService),
            const SizedBox(height: AppConstants.cardSpacing),

            // WebSocket Controls
            WebSocketControlsCard(websocketService: websocketService),
            const SizedBox(height: AppConstants.cardSpacing),

            // Order Management
            OrderManagementCard(
              websocketService: websocketService,
              onCreateOrder: () => _createOrder(websocketService),
              onCreateSampleOrders: () => _createSampleOrders(websocketService),
            ),
            const SizedBox(height: AppConstants.cardSpacing),

            // Real-time Status Updates
            StatusUpdatesCard(latestStatusUpdate: _latestStatusUpdate),
            const SizedBox(height: AppConstants.cardSpacing),

            // Kitchen Simulation
            KitchenSimulationCard(onSimulateKitchen: _simulateKitchenWorkflow),
            const SizedBox(
              height: AppConstants.defaultPadding,
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _createOrder(WebSocketService websocketService) async {
    final l10n = AppLocalizations.of(context)!;
    try {
      final order = await ApiService.createOrder(
        customerName: AppConstants.defaultCustomerName,
        items: AppConstants.sampleOrderItems,
      );

      if (order['success'] == true) {
        final newOrder = Order.fromJson(order['order']);
        websocketService.addOrder(newOrder);

        if (mounted) {
          _showSuccessSnackbar(l10n.orderCreated(newOrder.id));
        }
      }
    } catch (e) {
      if (mounted) {
        _showErrorSnackbar(l10n.errorCreatingOrder(e.toString()));
      }
    }
  }

  Future<void> _createSampleOrders(WebSocketService websocketService) async {
    final l10n = AppLocalizations.of(context)!;
    try {
      final orders = await ApiService.createSampleOrders();

      for (final order in orders) {
        websocketService.addOrder(order);
      }

      if (mounted) {
        _showSuccessSnackbar(l10n.createdSampleOrders(orders.length));
      }
    } catch (e) {
      if (mounted) {
        _showErrorSnackbar(l10n.errorCreatingSampleOrders(e.toString()));
      }
    }
  }

  Future<void> _simulateKitchenWorkflow() async {
    final l10n = AppLocalizations.of(context)!;
    try {
      final success = await ApiService.simulateKitchenWorkflow();

      if (mounted) {
        if (success) {
          _showSuccessSnackbar(l10n.kitchenWorkflowStarted);
        } else {
          _showErrorSnackbar(l10n.failedToStartKitchenWorkflow);
        }
      }
    } catch (e) {
      if (mounted) {
        _showErrorSnackbar(l10n.errorGeneric(e.toString()));
      }
    }
  }
}
