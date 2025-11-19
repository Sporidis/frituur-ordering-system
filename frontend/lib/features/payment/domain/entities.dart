// Payment domain entities
// These represent the core business objects for the Payment feature

class PaymentIntent {
  final String id;
  final String clientSecret;
  final double amount; // Amount in major units (e.g., EUR)
  final String currency;
  final String status;
  final Map<String, dynamic>? metadata;

  const PaymentIntent({
    required this.id,
    required this.clientSecret,
    required this.amount,
    required this.currency,
    required this.status,
    this.metadata,
  });

  factory PaymentIntent.fromJson(Map<String, dynamic> json) {
    return PaymentIntent(
      id: json['id'] as String? ?? '',
      clientSecret: json['clientSecret'] as String? ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      currency: (json['currency'] as String?)?.toLowerCase() ?? 'eur',
      status: json['status'] as String? ?? 'requires_payment_method',
      metadata: json['metadata'] as Map<String, dynamic>?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'clientSecret': clientSecret,
      'amount': amount,
      'currency': currency,
      'status': status,
      'metadata': metadata,
    };
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is PaymentIntent &&
        other.id == id &&
        other.clientSecret == clientSecret &&
        other.amount == amount &&
        other.currency == currency &&
        other.status == status;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        clientSecret.hashCode ^
        amount.hashCode ^
        currency.hashCode ^
        status.hashCode;
  }

  @override
  String toString() {
    return 'PaymentIntent(id: $id, amount: $amount€, status: $status)';
  }
}

class PaymentResult {
  final bool success;
  final String? paymentIntentId;
  final String? errorMessage;
  final String? status;

  const PaymentResult({
    required this.success,
    this.paymentIntentId,
    this.errorMessage,
    this.status,
  });

  factory PaymentResult.success(String paymentIntentId, String status) {
    return PaymentResult(
      success: true,
      paymentIntentId: paymentIntentId,
      status: status,
    );
  }

  factory PaymentResult.error(String errorMessage) {
    return PaymentResult(success: false, errorMessage: errorMessage);
  }

  @override
  String toString() {
    if (success) {
      return 'PaymentResult.success(id: $paymentIntentId, status: $status)';
    } else {
      return 'PaymentResult.error(message: $errorMessage)';
    }
  }
}

class Refund {
  final String id;
  final double? amount; // Amount in major units (nullable for full refunds)
  final String status;
  final String paymentIntentId;

  const Refund({
    required this.id,
    this.amount,
    required this.status,
    required this.paymentIntentId,
  });

  factory Refund.fromJson(Map<String, dynamic> json) {
    return Refund(
      id: json['id'] as String,
      amount: json['amount'] != null
          ? (json['amount'] as num).toDouble()
          : null,
      status: json['status'] as String,
      paymentIntentId: json['paymentIntentId'] as String,
    );
  }

  // Already in major units
  double? get amountInEuros => amount;

  @override
  String toString() {
    final amountStr = amountInEuros != null ? '$amountInEuros€' : 'full refund';
    return 'Refund(id: $id, amount: $amountStr, status: $status)';
  }
}
