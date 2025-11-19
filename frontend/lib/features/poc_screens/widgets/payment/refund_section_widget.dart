import 'package:flutter/material.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';
import 'package:frituur_ordering_system/features/payment/presentation/payment_view_model.dart';

class RefundSectionWidget extends StatelessWidget {
  final PaymentViewModel paymentViewModel;
  final TextEditingController refundAmountController;
  final VoidCallback onRefund;

  const RefundSectionWidget({
    super.key,
    required this.paymentViewModel,
    required this.refundAmountController,
    required this.onRefund,
  });

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    // Only show refund section when payment succeeded
    if (paymentViewModel.intent?.status != 'succeeded') {
      return const SizedBox.shrink();
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              l10n.refund,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Text(l10n.optionalRefundAmountHint),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: refundAmountController,
                    keyboardType: const TextInputType.numberWithOptions(
                      decimal: true,
                    ),
                    decoration: InputDecoration(
                      labelText: l10n.amount,
                      hintText: '10.50',
                      border: const OutlineInputBorder(),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton.icon(
                  onPressed: paymentViewModel.isRefunding ? null : onRefund,
                  icon: paymentViewModel.isRefunding
                      ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Icon(Icons.undo),
                  label: Text(l10n.refund),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    foregroundColor: Colors.white,
                  ),
                ),
              ],
            ),
            if (paymentViewModel.lastResult != null) ...[
              const SizedBox(height: 12),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red.withValues(alpha: 0.05),
                  border: Border.all(color: Colors.red.shade200),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(paymentViewModel.lastResult!),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
