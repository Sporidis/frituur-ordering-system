import 'package:flutter/material.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';
import 'package:frituur_ordering_system/shared/models/payment_models.dart'
    as payment;

class PaymentIntentDisplayWidget extends StatelessWidget {
  final payment.PaymentIntent paymentIntent;
  final bool isProcessing;
  final VoidCallback onProcessPayment;

  const PaymentIntentDisplayWidget({
    super.key,
    required this.paymentIntent,
    required this.isProcessing,
    required this.onProcessPayment,
  });

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
              l10n.paymentIntentCreated,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),

            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.blue.withValues(alpha: 0.1),
                border: Border.all(color: Colors.blue),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('${l10n.id} ${paymentIntent.id}'),
                  Text(
                    '${l10n.amountLabel} €${paymentIntent.amountInEuros.toStringAsFixed(2)}',
                  ),
                  Text(
                    '${l10n.currency} ${paymentIntent.currency.toUpperCase()}',
                  ),
                  Text('${l10n.status} ${paymentIntent.status}'),
                ],
              ),
            ),
            const SizedBox(height: 16),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: isProcessing ? null : onProcessPayment,
                icon: const Icon(Icons.credit_card),
                label: Text(
                  isProcessing ? l10n.processing : l10n.processPayment,
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
