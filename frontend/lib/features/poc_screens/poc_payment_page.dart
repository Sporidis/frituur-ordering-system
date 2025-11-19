import 'package:flutter/material.dart';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart';
import 'package:flutter_stripe/flutter_stripe.dart' as stripe;
import 'package:frituur_ordering_system/l10n/app_localizations.dart';

import 'package:frituur_ordering_system/shared/mod.dart';
import 'package:frituur_ordering_system/core/mod.dart';
import 'package:frituur_ordering_system/features/payment/mod.dart';

import 'widgets/mod.dart';

class PocPaymentPage extends StatefulWidget {
  const PocPaymentPage({super.key});

  @override
  State<PocPaymentPage> createState() => _PocPaymentPageState();
}

class _PocPaymentPageState extends State<PocPaymentPage> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController(text: '10.00');
  final _customerIdController = TextEditingController(
    text: AppConstants.defaultCustomerName,
  );
  final _orderIdController = TextEditingController(text: 'DEMO_ORDER_001');
  final _refundAmountController = TextEditingController();

  late PaymentViewModel _paymentViewModel;

  @override
  void initState() {
    super.initState();
    _paymentViewModel = PaymentViewModel(getIt<PaymentRepository>());
    _initializeStripe();
  }

  @override
  void dispose() {
    _amountController.dispose();
    _customerIdController.dispose();
    _orderIdController.dispose();
    _refundAmountController.dispose();
    _paymentViewModel.dispose();
    super.dispose();
  }

  Future<void> _initializeStripe() async {
    try {
      final initializeStripeUseCase = getIt<InitializeStripeUseCase>();
      await initializeStripeUseCase();
    } catch (e) {
      if (mounted) {
        final l10n = AppLocalizations.of(context)!;
        AppSnackbars.showError(
          context,
          l10n.failedToInitializeStripe(e.toString()),
        );
      }
    }
  }

  Future<void> _createPaymentIntent() async {
    if (!_formKey.currentState!.validate()) return;

    final amount = double.parse(_amountController.text);
    // Use customer name as customerId (backend expects customerId)
    final customerId = _customerIdController.text.trim().isNotEmpty
        ? _customerIdController.text.trim()
        : null;
    final orderId = _orderIdController.text.trim().isNotEmpty
        ? _orderIdController.text.trim()
        : null;

    final result = await _paymentViewModel.create(
      amount,
      orderId: orderId,
      customerId: customerId,
    );

    result.when(
      success: (paymentIntent) {
        AppSnackbars.showSuccess(
          context,
          AppLocalizations.of(
            context,
          )!.paymentIntentCreatedSuccess(paymentIntent.id),
        );
      },
      error: (error) {
        AppSnackbars.showError(context, error);
      },
    );
  }

  Future<void> _createDemoPayment() async {
    final result = await _paymentViewModel.create(
      10.00,
      orderId: 'DEMO_ORDER_${DateTime.now().millisecondsSinceEpoch}',
      customerId: 'demo_customer_${DateTime.now().millisecondsSinceEpoch}',
    );

    result.when(
      success: (paymentIntent) {
        AppSnackbars.showSuccess(
          context,
          AppLocalizations.of(
            context,
          )!.demoPaymentIntentCreated(paymentIntent.id),
        );
      },
      error: (error) {
        AppSnackbars.showError(context, error);
      },
    );
  }

  Future<void> _processPayment() async {
    if (_paymentViewModel.intent == null) return;

    try {
      // Desktop: open embedded webview with Stripe Elements
      if (!kIsWeb &&
          (Platform.isWindows || Platform.isLinux || Platform.isMacOS)) {
        final result = await Navigator.of(context).push<Map<String, dynamic>>(
          MaterialPageRoute(
            builder: (_) => PaymentElementsWebViewPage(
              clientSecret: _paymentViewModel.intent!.clientSecret,
              publishableKey: AppConstants.stripePublishableKey,
            ),
          ),
        );

        if (result != null && result['success'] == true) {
          if (mounted) {
            AppSnackbars.showSuccess(
              context,
              AppLocalizations.of(context)!.paymentSuccessful,
            );
          }
          _paymentViewModel.updatePaymentIntentStatus('succeeded');
        } else {
          if (mounted) {
            AppSnackbars.showError(
              context,
              'Payment failed: ${result != null ? (result['error'] ?? result['status'] ?? 'Unknown') : 'Unknown'}',
            );
          }
        }
        return;
      }

      // Initialize Payment Sheet
      await stripe.Stripe.instance.initPaymentSheet(
        paymentSheetParameters: stripe.SetupPaymentSheetParameters(
          paymentIntentClientSecret: _paymentViewModel.intent!.clientSecret,
          merchantDisplayName: 'Frituur Ordering System',
          style: ThemeMode.system,
          appearance: stripe.PaymentSheetAppearance(
            colors: stripe.PaymentSheetAppearanceColors(primary: Colors.orange),
          ),
        ),
      );

      // Present Payment Sheet
      await stripe.Stripe.instance.presentPaymentSheet();

      // Payment successful
      if (mounted) {
        AppSnackbars.showSuccess(
          context,
          AppLocalizations.of(context)!.paymentSuccessful,
        );
      }

      // Update the payment intent status to succeeded
      _paymentViewModel.updatePaymentIntentStatus('succeeded');
    } on stripe.StripeException catch (e) {
      // Handle Stripe-specific errors
      if (mounted) {
        AppSnackbars.showError(
          context,
          'Payment failed: ${e.error.localizedMessage ?? e.error.message ?? 'Unknown error'}',
        );
      }
    } catch (e) {
      // Handle other errors
      if (mounted) {
        AppSnackbars.showError(context, 'Payment failed: ${e.toString()}');
      }
    }
  }

  Future<void> _refundPayment() async {
    if (_paymentViewModel.intent == null) return;

    final amountText = _refundAmountController.text.trim();
    final amount = amountText.isEmpty ? null : double.tryParse(amountText);

    final result = await _paymentViewModel.refund(amount: amount);

    result.when(
      success: (refund) {
        AppSnackbars.showSuccess(
          context,
          AppLocalizations.of(context)!.refundSuccessful,
        );
      },
      error: (error) {
        AppSnackbars.showError(context, error);
      },
    );
  }

  Future<void> _refreshPaymentIntent() async {
    await _paymentViewModel.refreshPaymentIntent();
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: _paymentViewModel,
      builder: (context, child) {
        return Scaffold(
          appBar: const PaymentAppBar(),
          body: Center(
            child: ConstrainedBox(
              constraints: BoxConstraints(maxWidth: Responsive.maxContentWidth),
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(AppConstants.defaultPadding),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Payment Form
                    PaymentFormWidget(
                      formKey: _formKey,
                      amountController: _amountController,
                      customerNameController: _customerIdController,
                      orderIdController: _orderIdController,
                      isProcessing: _paymentViewModel.isLoading,
                      onCreatePaymentIntent: _createPaymentIntent,
                      onCreateDemoPayment: _createDemoPayment,
                    ),

                    const SizedBox(height: AppConstants.cardSpacing),

                    // Card Entry (mobile only)
                    const SizedBox(height: AppConstants.cardSpacing),

                    // Payment Intent Display
                    if (_paymentViewModel.intent != null) ...[
                      PaymentIntentDisplayWidget(
                        paymentIntent: _paymentViewModel.intent!,
                        isProcessing: _paymentViewModel.isLoading,
                        onProcessPayment: _processPayment,
                        onRefresh: _refreshPaymentIntent,
                      ),
                      const SizedBox(height: AppConstants.cardSpacing),

                      // Refund Section
                      RefundSectionWidget(
                        paymentViewModel: _paymentViewModel,
                        refundAmountController: _refundAmountController,
                        onRefund: _refundPayment,
                      ),
                      const SizedBox(height: AppConstants.cardSpacing),
                    ],

                    // Payment Result
                    if (_paymentViewModel.lastResult != null) ...[
                      PaymentResultWidget(
                        paymentResult: _paymentViewModel.lastResult!,
                      ),
                      const SizedBox(height: AppConstants.cardSpacing),
                    ],

                    // Test Cards Info
                    const TestCardInfoWidget(),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
