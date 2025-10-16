class PaymentIntent {
  final String id;
  final String clientSecret;
  final int amount; // Amount in cents
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
      id: json['id'] as String,
      clientSecret: json['clientSecret'] as String,
      amount: json['amount'] as int,
      currency: json['currency'] as String,
      status: json['status'] as String,
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

  // Helper to get amount in euros
  double get amountInEuros => amount / 100.0;

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
    return 'PaymentIntent(id: $id, amount: $amountInEuros€, status: $status)';
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
  final int amount; // Amount in cents
  final String status;
  final String paymentIntentId;

  const Refund({
    required this.id,
    required this.amount,
    required this.status,
    required this.paymentIntentId,
  });

  factory Refund.fromJson(Map<String, dynamic> json) {
    return Refund(
      id: json['id'] as String,
      amount: json['amount'] as int,
      status: json['status'] as String,
      paymentIntentId: json['paymentIntentId'] as String,
    );
  }

  // Helper to get amount in euros
  double get amountInEuros => amount / 100.0;

  @override
  String toString() {
    return 'Refund(id: $id, amount: $amountInEuros€, status: $status)';
  }
}
