import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';

import 'package:frituur_ordering_system/shared/mod.dart';
import 'package:frituur_ordering_system/shared/models/payment_models.dart'
    as payment;

import 'widgets/mod.dart';

class PocPaymentPage extends StatefulWidget {
  const PocPaymentPage({super.key});

  @override
  State<PocPaymentPage> createState() => _PocPaymentPageState();
}

class _PocPaymentPageState extends State<PocPaymentPage> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController(text: '19.99');
  final _customerNameController = TextEditingController(
    text: AppConstants.defaultCustomerName,
  );
  final _orderIdController = TextEditingController(text: 'DEMO_ORDER_001');

  payment.PaymentIntent? _currentPaymentIntent;
  bool _isProcessing = false;
  String? _lastPaymentResult;

  @override
  void initState() {
    super.initState();
    _initializeStripe();
  }

  @override
  void dispose() {
    _amountController.dispose();
    _customerNameController.dispose();
    _orderIdController.dispose();
    super.dispose();
  }

  Future<void> _initializeStripe() async {
    try {
      await PaymentService.initializeStripe();
    } catch (e) {
      if (mounted) {
        final l10n = AppLocalizations.of(context)!;
        _showErrorSnackbar(l10n.failedToInitializeStripe(e.toString()));
      }
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

  Future<void> _createPaymentIntent() async {
    if (!_formKey.currentState!.validate()) return;

    if (mounted) {
      setState(() {
        _isProcessing = true;
        _currentPaymentIntent = null;
        _lastPaymentResult = null;
      });
    }

    try {
      final amount = double.parse(_amountController.text);
      final customerName = _customerNameController.text;
      final orderId = _orderIdController.text;

      final paymentIntent = await PaymentService.createPaymentIntent(
        amount: amount,
        orderId: orderId,
        customerName: customerName,
      );

      if (paymentIntent != null) {
        if (mounted) {
          setState(() {
            _currentPaymentIntent = paymentIntent;
          });
        }
        if (mounted) {
          _showSuccessSnackbar(
            AppLocalizations.of(
              context,
            )!.paymentIntentCreatedSuccess(paymentIntent.id),
          );
        }
      } else {
        if (mounted) {
          _showErrorSnackbar(
            AppLocalizations.of(context)!.failedToCreatePaymentIntent,
          );
        }
      }
    } catch (e) {
      if (mounted) {
        _showErrorSnackbar(
          AppLocalizations.of(context)!.errorGeneric(e.toString()),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isProcessing = false;
        });
      }
    }
  }

  Future<void> _processPayment() async {
    if (_currentPaymentIntent == null) return;

    if (mounted) {
      setState(() {
        _isProcessing = true;
      });
    }

    try {
      final result = await PaymentService.processPayment(
        clientSecret: _currentPaymentIntent!.clientSecret,
        customerName:
            _currentPaymentIntent!.metadata?['customerName'] ??
            AppLocalizations.of(context)!.customer,
      );

      if (mounted) {
        setState(() {
          _lastPaymentResult = result.toString();
        });
      }

      if (mounted) {
        if (result.success) {
          _showSuccessSnackbar(AppLocalizations.of(context)!.paymentSuccessful);
        } else {
          _showErrorSnackbar(
            AppLocalizations.of(
              context,
            )!.paymentFailed(result.errorMessage ?? ''),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        _showErrorSnackbar(
          AppLocalizations.of(context)!.errorProcessingPayment(e.toString()),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isProcessing = false;
        });
      }
    }
  }

  Future<void> _createDemoPayment() async {
    if (mounted) {
      setState(() {
        _isProcessing = true;
        _currentPaymentIntent = null;
        _lastPaymentResult = null;
      });
    }

    try {
      final paymentIntent = await PaymentService.createDemoPayment();

      if (paymentIntent != null) {
        if (mounted) {
          setState(() {
            _currentPaymentIntent = paymentIntent as PaymentIntent?;
          });
        }
        if (mounted) {
          _showSuccessSnackbar(
            AppLocalizations.of(
              context,
            )!.demoPaymentIntentCreated(paymentIntent.id),
          );
        }
      } else {
        if (mounted) {
          _showErrorSnackbar(
            AppLocalizations.of(context)!.failedToCreateDemoPayment,
          );
        }
      }
    } catch (e) {
      if (mounted) {
        _showErrorSnackbar(
          AppLocalizations.of(context)!.errorGeneric(e.toString()),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isProcessing = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final languageProvider = Provider.of<LanguageProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('${l10n.appTitle} - ${l10n.paymentPoc}'),
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
            // Payment Form
            PaymentFormWidget(
              formKey: _formKey,
              amountController: _amountController,
              customerNameController: _customerNameController,
              orderIdController: _orderIdController,
              isProcessing: _isProcessing,
              onCreatePaymentIntent: _createPaymentIntent,
              onCreateDemoPayment: _createDemoPayment,
            ),

            const SizedBox(height: AppConstants.cardSpacing),

            // Payment Intent Status
            if (_currentPaymentIntent != null) ...[
              PaymentIntentDisplayWidget(
                paymentIntent: _currentPaymentIntent!,
                isProcessing: _isProcessing,
                onProcessPayment: _processPayment,
              ),
              const SizedBox(height: AppConstants.cardSpacing),
            ],

            // Payment Result
            if (_lastPaymentResult != null) ...[
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        l10n.paymentResult,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.green.withValues(alpha: 0.1),
                          border: Border.all(color: Colors.green),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(_lastPaymentResult!),
                      ),
                    ],
                  ),
                ),
              ),
            ],

            // Test Cards Info
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      l10n.testCardNumbers,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(l10n.useTestCardNumbers),
                    const SizedBox(height: 8),
                    Text(l10n.visaTestCard),
                    Text(l10n.mastercardTestCard),
                    Text(l10n.declinedTestCard),
                    Text(l10n.testCardInstructions),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
