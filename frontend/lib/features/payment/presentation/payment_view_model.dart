import 'package:flutter/foundation.dart';
import '../../payment/domain/entities.dart';
import '../../payment/domain/repositories/payment_repository.dart';
import '../../../core/utils/result.dart';

class PaymentViewModel extends ChangeNotifier {
  final PaymentRepository repository;
  PaymentViewModel(this.repository);

  PaymentIntent? _intent;
  bool _loading = false;
  bool _refunding = false;
  String? _lastResult;

  PaymentIntent? get intent => _intent;
  bool get isLoading => _loading;
  bool get isRefunding => _refunding;
  String? get lastResult => _lastResult;

  Future<Result<PaymentIntent>> create(
    double amount, {
    String? orderId,
    String? customerId,
  }) async {
    _loading = true;
    notifyListeners();
    final res = await repository.createPaymentIntent(
      amount: amount,
      orderId: orderId,
      customerId: customerId,
    );
    res.when(success: (i) => _intent = i, error: (_) {});
    _loading = false;
    notifyListeners();
    return res;
  }

  Future<Result<PaymentResult>> process(String customer) async {
    if (_intent == null) return const ErrorResult('No intent');
    _loading = true;
    notifyListeners();
    final res = await repository.processPayment(
      clientSecret: _intent!.clientSecret,
      customerName: customer,
      paymentIntentId: _intent!.id,
    );
    res.when(
      success: (r) {
        _lastResult = r.toString();
        // Update the payment intent status to succeeded since payment was successful
        if (_intent != null) {
          _intent = PaymentIntent(
            id: _intent!.id,
            amount: _intent!.amount,
            currency: _intent!.currency,
            status: 'succeeded', // Update status to succeeded
            clientSecret: _intent!.clientSecret,
            metadata: _intent!.metadata,
          );
        }
      },
      error: (m) {
        _lastResult = m;
      },
    );
    _loading = false;
    notifyListeners();
    return res;
  }

  Future<Result<Refund>> refund({double? amount}) async {
    if (_intent == null) return const ErrorResult('No intent');
    _refunding = true;
    notifyListeners();
    final res = await repository.refund(
      paymentIntentId: _intent!.id,
      amount: amount,
    );
    _refunding = false;
    notifyListeners();
    return res;
  }

  Future<void> refreshPaymentIntent() async {
    if (_intent == null) return;
    _loading = true;
    notifyListeners();
    final refreshed = await repository.getPaymentIntent(_intent!.id);
    refreshed.when(
      success: (i) => _intent = i,
      error: (error) {
        // If payment intent not found, it might have been consumed after successful payment
        // In this case, we can't refresh it, so we'll keep the current status
      },
    );
    _loading = false;
    notifyListeners();
  }

  void updatePaymentIntentStatus(String status) {
    if (_intent == null) return;
    _intent = PaymentIntent(
      id: _intent!.id,
      amount: _intent!.amount,
      currency: _intent!.currency,
      status: status,
      clientSecret: _intent!.clientSecret,
      metadata: _intent!.metadata,
    );
    notifyListeners();
  }
}
