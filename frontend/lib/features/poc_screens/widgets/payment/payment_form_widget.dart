import 'package:flutter/material.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';

class PaymentFormWidget extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final TextEditingController amountController;
  final TextEditingController customerNameController;
  final TextEditingController orderIdController;
  final bool isProcessing;
  final VoidCallback onCreatePaymentIntent;
  final VoidCallback onCreateDemoPayment;

  const PaymentFormWidget({
    super.key,
    required this.formKey,
    required this.amountController,
    required this.customerNameController,
    required this.orderIdController,
    required this.isProcessing,
    required this.onCreatePaymentIntent,
    required this.onCreateDemoPayment,
  });

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                l10n.paymentDetails,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),

              // Amount
              TextFormField(
                controller: amountController,
                decoration: InputDecoration(
                  labelText: l10n.amount,
                  border: const OutlineInputBorder(),
                  prefixText: '€ ',
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return l10n.pleaseEnterAmount;
                  }
                  final amount = double.tryParse(value);
                  if (amount == null || amount <= 0) {
                    return l10n.pleaseEnterValidAmount;
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Customer Name
              TextFormField(
                controller: customerNameController,
                decoration: InputDecoration(
                  labelText: l10n.customerName,
                  border: const OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return l10n.pleaseEnterCustomerName;
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Order ID
              TextFormField(
                controller: orderIdController,
                decoration: InputDecoration(
                  labelText: l10n.orderId,
                  border: const OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return l10n.pleaseEnterOrderId;
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Create Payment Intent Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: isProcessing ? null : onCreatePaymentIntent,
                  icon: const Icon(Icons.payment),
                  label: Text(
                    isProcessing ? l10n.creating : l10n.createPaymentIntent,
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Create Demo Payment Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: isProcessing ? null : onCreateDemoPayment,
                  icon: const Icon(Icons.smart_toy),
                  label: Text(l10n.createDemoPayment),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.purple,
                    foregroundColor: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
