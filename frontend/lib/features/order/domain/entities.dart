// Order domain entities
// These represent the core business objects for the Order feature

class OrderItem {
  final String id;
  final String name;
  final double price;
  final int quantity;

  const OrderItem({
    required this.id,
    required this.name,
    required this.price,
    required this.quantity,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      quantity: json['quantity'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'name': name, 'price': price, 'quantity': quantity};
  }

  OrderItem copyWith({String? id, String? name, double? price, int? quantity}) {
    return OrderItem(
      id: id ?? this.id,
      name: name ?? this.name,
      price: price ?? this.price,
      quantity: quantity ?? this.quantity,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is OrderItem &&
        other.id == id &&
        other.name == name &&
        other.price == price &&
        other.quantity == quantity;
  }

  @override
  int get hashCode {
    return id.hashCode ^ name.hashCode ^ price.hashCode ^ quantity.hashCode;
  }

  @override
  String toString() {
    return 'OrderItem(id: $id, name: $name, price: $price, quantity: $quantity)';
  }
}

class Order {
  final String id;
  final String customerName;
  final List<OrderItem> items;
  final double totalAmount;
  final OrderStatus status;
  final DateTime estimatedReadyTime;
  final DateTime createdAt;

  const Order({
    required this.id,
    required this.customerName,
    required this.items,
    required this.totalAmount,
    required this.status,
    required this.estimatedReadyTime,
    required this.createdAt,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'] as String? ?? '',
      customerName: json['customerName'] as String? ?? '',
      items:
          (json['items'] as List<dynamic>?)
              ?.map((item) => OrderItem.fromJson(item as Map<String, dynamic>))
              .toList() ??
          [],
      totalAmount: (json['totalAmount'] as num?)?.toDouble() ?? 0.0,
      status: OrderStatus.fromString(json['status'] as String? ?? 'pending'),
      estimatedReadyTime: json['estimatedReadyTime'] != null
          ? DateTime.parse(json['estimatedReadyTime'] as String)
          : DateTime.now(),
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'customerName': customerName,
      'items': items.map((item) => item.toJson()).toList(),
      'totalAmount': totalAmount,
      'status': status.name,
      'estimatedReadyTime': estimatedReadyTime.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
    };
  }

  Order copyWith({
    String? id,
    String? customerName,
    List<OrderItem>? items,
    double? totalAmount,
    OrderStatus? status,
    DateTime? estimatedReadyTime,
    DateTime? createdAt,
  }) {
    return Order(
      id: id ?? this.id,
      customerName: customerName ?? this.customerName,
      items: items ?? this.items,
      totalAmount: totalAmount ?? this.totalAmount,
      status: status ?? this.status,
      estimatedReadyTime: estimatedReadyTime ?? this.estimatedReadyTime,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Order &&
        other.id == id &&
        other.customerName == customerName &&
        other.totalAmount == totalAmount &&
        other.status == status &&
        other.estimatedReadyTime == estimatedReadyTime &&
        other.createdAt == createdAt;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        customerName.hashCode ^
        totalAmount.hashCode ^
        status.hashCode ^
        estimatedReadyTime.hashCode ^
        createdAt.hashCode;
  }

  @override
  String toString() {
    return 'Order(id: $id, customerName: $customerName, totalAmount: $totalAmount, status: $status)';
  }
}

enum OrderStatus {
  pending,
  inProgress,
  ready,
  completed;

  static OrderStatus fromString(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return OrderStatus.pending;
      case 'in_progress':
        return OrderStatus.inProgress;
      case 'ready':
        return OrderStatus.ready;
      case 'completed':
        return OrderStatus.completed;
      default:
        return OrderStatus.pending;
    }
  }

  String get displayName {
    switch (this) {
      case OrderStatus.pending:
        return 'Pending';
      case OrderStatus.inProgress:
        return 'In Progress';
      case OrderStatus.ready:
        return 'Ready';
      case OrderStatus.completed:
        return 'Completed';
    }
  }

  // Helper function to get localized status name
  String getLocalizedDisplayName(dynamic l10n) {
    switch (this) {
      case OrderStatus.pending:
        return l10n.statusPending;
      case OrderStatus.inProgress:
        return l10n.statusInProgress;
      case OrderStatus.ready:
        return l10n.statusReady;
      case OrderStatus.completed:
        return l10n.statusCompleted;
    }
  }

  // Helper function to get localized status change message
  String getLocalizedStatusChangeMessage(dynamic l10n) {
    switch (this) {
      case OrderStatus.pending:
        return l10n.statusChangedToPending;
      case OrderStatus.inProgress:
        return l10n.statusChangedToInProgress;
      case OrderStatus.ready:
        return l10n.statusChangedToReady;
      case OrderStatus.completed:
        return l10n.statusChangedToCompleted;
    }
  }

  String get apiName {
    switch (this) {
      case OrderStatus.pending:
        return 'pending';
      case OrderStatus.inProgress:
        return 'in_progress';
      case OrderStatus.ready:
        return 'ready';
      case OrderStatus.completed:
        return 'completed';
    }
  }
}

class OrderStatusUpdate {
  final String orderId;
  final OrderStatus status;
  final DateTime? estimatedReadyTime;
  final String? message;
  final String timestamp;

  const OrderStatusUpdate({
    required this.orderId,
    required this.status,
    this.estimatedReadyTime,
    this.message,
    required this.timestamp,
  });

  factory OrderStatusUpdate.fromJson(Map<String, dynamic> json) {
    return OrderStatusUpdate(
      orderId: json['orderId'] as String,
      status: OrderStatus.fromString(json['status'] as String),
      estimatedReadyTime: json['estimatedReadyTime'] != null
          ? DateTime.parse(json['estimatedReadyTime'] as String)
          : null,
      message: json['message'] as String?,
      timestamp: json['timestamp'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'orderId': orderId,
      'status': status.apiName,
      'estimatedReadyTime': estimatedReadyTime?.toIso8601String(),
      'message': message,
      'timestamp': timestamp,
    };
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is OrderStatusUpdate &&
        other.orderId == orderId &&
        other.status == status &&
        other.estimatedReadyTime == estimatedReadyTime &&
        other.message == message &&
        other.timestamp == timestamp;
  }

  @override
  int get hashCode {
    return orderId.hashCode ^
        status.hashCode ^
        estimatedReadyTime.hashCode ^
        message.hashCode ^
        timestamp.hashCode;
  }

  // Helper function to get localized message
  String getLocalizedMessage(dynamic l10n) {
    if (message == null) {
      return status.getLocalizedStatusChangeMessage(l10n);
    }

    switch (message) {
      case 'kitchen_started_preparing':
        return l10n.kitchenStartedPreparing;
      case 'order_ready_for_pickup':
        return l10n.orderReadyForPickup;
      case 'status_changed_to_pending':
        return l10n.statusChangedToPending;
      case 'status_changed_to_in_progress':
        return l10n.statusChangedToInProgress;
      case 'status_changed_to_ready':
        return l10n.statusChangedToReady;
      case 'status_changed_to_completed':
        return l10n.statusChangedToCompleted;
      default:
        return message!; // Return original message if no translation found
    }
  }

  @override
  String toString() {
    return 'OrderStatusUpdate(orderId: $orderId, status: $status, message: $message)';
  }
}
