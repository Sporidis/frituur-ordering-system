import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';
import 'package:frituur_ordering_system/features/websocket/mod.dart';
import 'package:frituur_ordering_system/features/auth/mod.dart';
import 'package:frituur_ordering_system/features/order/mod.dart';
import 'package:frituur_ordering_system/shared/mod.dart';
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

    // Get repository from DI
    final repository = getIt<WebSocketRepository>();
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
      final createOrderUseCase = getIt<CreateOrderUseCase>();
      final result = await createOrderUseCase(
        CreateOrderParams(
          customerName: AppConstants.defaultCustomerName,
          items: AppConstants.sampleOrderItems,
        ),
      );

      result.when(
        success: (orderData) {
          if (orderData['success'] == true) {
            final newOrder = Order.fromJson(orderData['order']);
            _webSocketViewModel.addOrder(newOrder);

            if (mounted) {
              _showSuccessSnackbar(l10n.orderCreated(newOrder.id));
            }
          }
        },
        error: (error) {
          if (mounted) {
            _showErrorSnackbar(l10n.errorCreatingOrder(error));
          }
        },
      );
    } catch (e) {
      if (mounted) {
        _showErrorSnackbar(l10n.errorCreatingOrder(e.toString()));
      }
    }
  }

  Future<void> _createSampleOrders() async {
    final l10n = AppLocalizations.of(context)!;
    try {
      final createSampleOrdersUseCase = getIt<CreateSampleOrdersUseCase>();
      final result = await createSampleOrdersUseCase();

      result.when(
        success: (orders) {
          for (final order in orders) {
            _webSocketViewModel.addOrder(order);
          }

          if (mounted) {
            _showSuccessSnackbar(l10n.createdSampleOrders(orders.length));
          }
        },
        error: (error) {
          if (mounted) {
            _showErrorSnackbar(l10n.errorCreatingSampleOrders(error));
          }
        },
      );
    } catch (e) {
      if (mounted) {
        _showErrorSnackbar(l10n.errorCreatingSampleOrders(e.toString()));
      }
    }
  }

  Future<void> _simulateKitchenWorkflow() async {
    final l10n = AppLocalizations.of(context)!;
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    if (!authProvider.isAuthenticated) {
      _showErrorSnackbar('You must be logged in as Admin to simulate kitchen.');
      return;
    }

    try {
      final token = await authProvider.getToken();
      final simulateKitchenUseCase = getIt<SimulateKitchenWorkflowUseCase>();
      final result = await simulateKitchenUseCase(
        SimulateKitchenWorkflowParams(token: token),
      );

      if (mounted) {
        result.when(
          success: (success) {
            if (success) {
              _showSuccessSnackbar(l10n.kitchenWorkflowStarted);
            } else {
              _showErrorSnackbar(l10n.failedToStartKitchenWorkflow);
            }
          },
          error: (error) {
            _showErrorSnackbar(l10n.errorGeneric(error));
          },
        );
      }
    } catch (e) {
      if (mounted) {
        _showErrorSnackbar(l10n.errorGeneric(e.toString()));
      }
    }
  }
}
