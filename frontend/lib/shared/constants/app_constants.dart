// Application constants for the frituur ordering system

class AppConstants {
  // API Configuration
  static const String baseUrl = 'http://localhost:3000';
  static const Duration connectionTimeout = Duration(seconds: 30);
  static const Duration snackbarDuration = Duration(seconds: 3);

  // UI Constants
  static const double defaultPadding = 16.0;
  static const double cardSpacing = 20.0;
  static const double buttonSpacing = 8.0;

  // Sample Data
  static const String defaultCustomerName = 'Test Customer';
  static const List<Map<String, dynamic>> sampleOrderItems = [
    {'name': 'Large Fries', 'price': 3.5, 'quantity': 1},
    {'name': 'Cheeseburger', 'price': 8.5, 'quantity': 1},
    {'name': 'Coca Cola', 'price': 2.0, 'quantity': 1},
  ];

  // Colors
  static const Map<String, int> statusColors = {
    'pending': 0xFFFF9800, // Orange
    'inProgress': 0xFF2196F3, // Blue
    'ready': 0xFF4CAF50, // Green
    'completed': 0xFF9E9E9E, // Grey
  };

  // WebSocket Events
  static const String wsEventJoinRoom = 'join_order_room';
  static const String wsEventLeaveRoom = 'leave_order_room';
  static const String wsEventJoinedRoom = 'joined_order_room';
  static const String wsEventOrderStatusUpdate = 'order_status_updated';
  static const String wsEventNewOrder = 'new_order';

  // API Endpoints
  static const String apiOrders = '/orders';
  static const String apiOrdersDemo = '/orders/demo/create-sample';
  static const String apiKitchenSimulation =
      '/orders/simulate/kitchen-workflow';
  static const String apiOrderStats = '/orders/stats/overview';
}

// Extension for easy color access
extension StatusColorExtension on String {
  int get statusColor {
    return AppConstants.statusColors[toLowerCase()] ??
        AppConstants.statusColors['pending']!;
  }
}
