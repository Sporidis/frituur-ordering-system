import 'package:flutter/material.dart';
import 'package:frituur_ordering_system/features/websocket/presentation/websocket_view_model.dart';
import 'package:frituur_ordering_system/features/websocket/data/websocket_repository_impl.dart';
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
  late WebSocketViewModel _webSocketViewModel;

  @override
  void initState() {
    super.initState();

    // Create the ViewModel with the repository
    final websocketService = Provider.of<WebSocketService>(
      context,
      listen: false,
    );
    final repository = SocketIoWebSocketRepository(websocketService);
    _webSocketViewModel = WebSocketViewModel(repository);

    // Initialize the ViewModel
    _webSocketViewModel.initialize();
  }

  @override
  void dispose() {
    _webSocketViewModel.dispose();
    super.dispose();
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

    return ListenableBuilder(
      listenable: _webSocketViewModel,
      builder: (context, child) {
        return Scaffold(
          appBar: AppBar(
            title: Text('${l10n.appTitle} - ${l10n.poc2Websocket}'),
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
          body: Center(
            child: ConstrainedBox(
              constraints: BoxConstraints(maxWidth: Responsive.maxContentWidth),
              child: Padding(
                padding: const EdgeInsets.all(AppConstants.defaultPadding),
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Connection Status
                      ConnectionStatusCard(
                        webSocketViewModel: _webSocketViewModel,
                      ),
                      const SizedBox(height: AppConstants.cardSpacing),

                      // WebSocket Controls
                      WebSocketControlsCard(
                        webSocketViewModel: _webSocketViewModel,
                      ),
                      const SizedBox(height: AppConstants.cardSpacing),

                      // Order Management
                      OrderManagementCard(
                        webSocketViewModel: _webSocketViewModel,
                        onCreateOrder: () => _createOrder(),
                        onCreateSampleOrders: () => _createSampleOrders(),
                      ),
                      const SizedBox(height: AppConstants.cardSpacing),

                      // Real-time Status Updates
                      StatusUpdatesCard(
                        latestStatusUpdate:
                            _webSocketViewModel.lastStatusUpdate,
                      ),
                      const SizedBox(height: AppConstants.cardSpacing),

                      // Kitchen Simulation
                      KitchenSimulationCard(
                        onSimulateKitchen: _simulateKitchenWorkflow,
                      ),
                      const SizedBox(height: AppConstants.defaultPadding),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Future<void> _createOrder() async {
    final l10n = AppLocalizations.of(context)!;
    try {
      final order = await ApiService.createOrder(
        customerName: AppConstants.defaultCustomerName,
        items: AppConstants.sampleOrderItems,
      );

      if (order['success'] == true) {
        final newOrder = Order.fromJson(order['order']);
        _webSocketViewModel.addOrder(newOrder);

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

  Future<void> _createSampleOrders() async {
    final l10n = AppLocalizations.of(context)!;
    try {
      final orders = await ApiService.createSampleOrders();

      for (final order in orders) {
        _webSocketViewModel.addOrder(order);
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
