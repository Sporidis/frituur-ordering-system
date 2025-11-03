import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_stripe/flutter_stripe.dart' as stripe;

class CardEntryWidget extends StatefulWidget {
  const CardEntryWidget({super.key});

  @override
  State<CardEntryWidget> createState() => _CardEntryWidgetState();
}

class _CardEntryWidgetState extends State<CardEntryWidget> {
  bool _isStripeInitialized = false;

  @override
  void initState() {
    super.initState();
    _checkStripeInitialization();
  }

  Future<void> _checkStripeInitialization() async {
    try {
      // Check if Stripe is initialized by trying to access it
      stripe.Stripe.instance.isPlatformPaySupported;
      if (mounted) {
        setState(() {
          _isStripeInitialized = true;
        });
      }
    } catch (e) {
      // Stripe not initialized or failed to initialize
      if (mounted) {
        setState(() {
          _isStripeInitialized = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    // Only show payment methods on mobile platforms
    if (kIsWeb) {
      return const SizedBox.shrink();
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Payment Methods',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            if (_isStripeInitialized) ...[
              // For this PoC, we'll use CardField
              // In production, you'd use Payment Sheet for multiple payment methods
              stripe.CardField(
                autofocus: false,
                onCardChanged: (card) {
                  // Card completion status could be used for validation
                },
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.blue.shade50,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.blue.shade200),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.info_outline,
                          color: Colors.blue.shade700,
                          size: 16,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Production Implementation',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Colors.blue.shade700,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Use Stripe Payment Sheet for automatic payment method detection:\n• Cards, Apple Pay, Google Pay\n• Local methods (iDEAL, SEPA, etc.)\n• Device-specific options',
                      style: TextStyle(
                        color: Colors.blue.shade600,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ),
            ] else ...[
              Container(
                height: 50,
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Center(
                  child: Text(
                    'Stripe Payment Methods\n(Android configuration required)',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'In production, Stripe Payment Sheet will automatically show:\n• Credit/Debit Cards\n• Apple Pay (iOS)\n• Google Pay (Android)\n• Local payment methods (iDEAL, SEPA, etc.)',
                style: TextStyle(color: Colors.grey[600], fontSize: 12),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
