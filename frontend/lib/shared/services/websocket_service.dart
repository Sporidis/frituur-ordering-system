import 'dart:async';
import 'dart:io';
import 'package:socket_io_client/socket_io_client.dart' as io;
import 'package:flutter/foundation.dart';

import '../models/order_models.dart';
import '../models/ws_models.dart';

String getUrlFromHost() {
  if (kIsWeb) return 'localhost';
  if (Platform.isAndroid) return '10.0.2.2';
  if (Platform.isIOS) return 'localhost';
  return 'localhost';
}

class WebSocketService extends ChangeNotifier {
  io.Socket? _socket;
  bool _isConnected = false;
  String? _currentOrderId;
  final List<Order> _orders = [];
  final StreamController<OrderStatusUpdate> _orderStatusController =
      StreamController<OrderStatusUpdate>.broadcast();

  // New streams for PoC testing features (typed DTOs)
  final StreamController<ConnectionStats> _connectionStatsController =
      StreamController<ConnectionStats>.broadcast();
  final StreamController<ServerPong> _pongController =
      StreamController<ServerPong>.broadcast();

  // Getters
  bool get isConnected => _isConnected;
  String? get currentOrderId => _currentOrderId;
  List<Order> get orders => List.unmodifiable(_orders);
  Stream<OrderStatusUpdate> get orderStatusStream =>
      _orderStatusController.stream;
  Stream<ConnectionStats> get connectionStatsStream =>
      _connectionStatsController.stream;
  Stream<ServerPong> get pongStream => _pongController.stream;

  // Connection management
  Future<void> connect() async {
    final host = getUrlFromHost();
    try {
      _socket = io.io('http://$host:3000', <String, dynamic>{
        'transports': ['websocket', 'polling'],
        'autoConnect': false,
        'reconnection': true,
        'reconnectionAttempts': 5,
        'reconnectionDelay': 1000,
        'timeout': 20000,
      });

      _setupEventListeners();
      _socket!.connect();

      debugPrint('🔌 WebSocket: Attempting to connect...');
    } catch (e) {
      debugPrint('❌ WebSocket connection error: $e');
    }
  }

  void disconnect() {
    if (_socket != null) {
      _socket!.disconnect();
      _socket = null;
      _isConnected = false;
      notifyListeners();
      debugPrint('🔌 WebSocket: Disconnected');
    }
  }

  void _setupEventListeners() {
    _socket!.onConnect((_) {
      _isConnected = true;
      notifyListeners();
      debugPrint('✅ WebSocket: Connected successfully');

      // Auto rejoin previous room after reconnect
      if (_currentOrderId != null) {
        joinOrderRoom(_currentOrderId!);
      }
    });

    _socket!.onDisconnect((_) {
      _isConnected = false;
      notifyListeners();
      debugPrint('❌ WebSocket: Disconnected');
    });

    _socket!.onConnectError((error) {
      debugPrint('❌ WebSocket connection error: $error');
    });

    _socket!.on('joined_order_room', (data) {
      debugPrint('🏠 WebSocket: Joined order room: $data');
    });

    _socket!.on('order_status_updated', (data) {
      debugPrint('📢 WebSocket: Order status update received: $data');
      try {
        final update = OrderStatusUpdate.fromJson(data);
        _orderStatusController.add(update);
      } catch (e) {
        debugPrint('❌ Error parsing order status update: $e');
      }
    });

    _socket!.on('new_order', (data) {
      debugPrint('🆕 WebSocket: New order received: $data');
      try {
        final order = Order.fromJson(data);
        _orders.add(order);
        notifyListeners();
      } catch (e) {
        debugPrint('❌ Error parsing new order: $e');
      }
    });

    // Event listeners for PoC testing
    _socket!.on('connection_confirmed', (data) {
      debugPrint('🔗 WebSocket: Connection confirmed: $data');
    });

    _socket!.on('server_pong', (data) {
      debugPrint('🏓 WebSocket: Pong received: $data');
      if (data is Map<String, dynamic>) {
        try {
          _pongController.add(ServerPong.fromJson(data));
        } catch (e) {
          debugPrint('❌ Error parsing server pong: $e');
        }
      }
    });

    _socket!.on('connection_stats', (data) {
      debugPrint('📊 WebSocket: Connection stats received: $data');
      if (data is Map<String, dynamic>) {
        try {
          _connectionStatsController.add(ConnectionStats.fromJson(data));
        } catch (e) {
          debugPrint('❌ Error parsing connection stats: $e');
        }
      }
    });
  }

  // Order room management
  void joinOrderRoom(String orderId) {
    if (_socket != null && _isConnected) {
      _currentOrderId = orderId;
      _socket!.emit('join_order_room', {'orderId': orderId});
      debugPrint('🏠 WebSocket: Joining order room: $orderId');
    }
  }

  void leaveOrderRoom(String orderId) {
    if (_socket != null && _isConnected) {
      _socket!.emit('leave_order_room', {'orderId': orderId});
      if (_currentOrderId == orderId) {
        _currentOrderId = null;
      }
      debugPrint('🚪 WebSocket: Leaving order room: $orderId');
    }
  }

  // Order management
  void addOrder(Order order) {
    _orders.add(order);
    notifyListeners();
  }

  Order? getOrderById(String orderId) {
    try {
      return _orders.firstWhere((order) => order.id == orderId);
    } catch (e) {
      return null;
    }
  }

  void clearOrders() {
    _orders.clear();
    notifyListeners();
  }

  // New methods for PoC testing
  void pingServer() {
    if (_socket != null && _isConnected) {
      _socket!.emit('client_ping');
      debugPrint('🏓 WebSocket: Ping sent to server');
    }
  }

  void requestConnectionStats() {
    if (_socket != null && _isConnected) {
      _socket!.emit('get_connection_stats');
      debugPrint('📊 WebSocket: Requesting connection statistics');
    }
  }

  @override
  void dispose() {
    disconnect();
    _orderStatusController.close();
    _connectionStatsController.close();
    _pongController.close();
    super.dispose();
  }
}
