import 'package:flutter/foundation.dart';
import '../../../shared/models/ws_models.dart';
import '../domain/entities.dart';
import '../domain/repositories/websocket_repository.dart';
import '../../../core/utils/result.dart';

class WebSocketViewModel extends ChangeNotifier {
  final WebSocketRepository _repository;

  WebSocketViewModel(this._repository);

  // Connection state
  bool _isConnected = false;
  String? _currentOrderId;
  String? _lastError;

  // Order state
  final List<Order> _orders = [];
  OrderStatusUpdate? _lastStatusUpdate;

  // PoC testing state
  ServerPong? _lastPong;
  ConnectionStats? _lastConnectionStats;
  bool _isTesting = false;

  // Getters
  bool get isConnected => _isConnected;
  String? get currentOrderId => _currentOrderId;
  String? get lastError => _lastError;
  List<Order> get orders => List.unmodifiable(_orders);
  OrderStatusUpdate? get lastStatusUpdate => _lastStatusUpdate;
  ServerPong? get lastPong => _lastPong;
  ConnectionStats? get lastConnectionStats => _lastConnectionStats;
  bool get isTesting => _isTesting;

  // Initialize streams
  void initialize() {
    _repository.connectionStream.listen((connected) {
      _isConnected = connected;
      notifyListeners();
    });

    _repository.ordersStream.listen((orders) {
      _orders.clear();
      _orders.addAll(orders);
      notifyListeners();
    });

    _repository.orderStatusStream.listen((update) {
      _lastStatusUpdate = update;
      notifyListeners();
    });

    _repository.pongStream.listen((pong) {
      _lastPong = pong;
      notifyListeners();
    });

    _repository.connectionStatsStream.listen((stats) {
      _lastConnectionStats = stats;
      notifyListeners();
    });
  }

  // Connection management
  Future<Result<void>> connect() async {
    _lastError = null;
    notifyListeners();

    final result = await _repository.connect();
    result.when(
      success: (_) {
        _isConnected = true;
      },
      error: (error) {
        _lastError = error;
        _isConnected = false;
      },
    );
    notifyListeners();
    return result;
  }

  Future<Result<void>> disconnect() async {
    _lastError = null;
    notifyListeners();

    final result = await _repository.disconnect();
    result.when(
      success: (_) {
        _isConnected = false;
        _currentOrderId = null;
      },
      error: (error) {
        _lastError = error;
      },
    );
    notifyListeners();
    return result;
  }

  // Order room management
  Future<Result<void>> joinOrderRoom(String orderId) async {
    _lastError = null;
    notifyListeners();

    final result = await _repository.joinOrderRoom(orderId);
    result.when(
      success: (_) {
        _currentOrderId = orderId;
      },
      error: (error) {
        _lastError = error;
      },
    );
    notifyListeners();
    return result;
  }

  Future<Result<void>> leaveOrderRoom(String orderId) async {
    _lastError = null;
    notifyListeners();

    final result = await _repository.leaveOrderRoom(orderId);
    result.when(
      success: (_) {
        if (_currentOrderId == orderId) {
          _currentOrderId = null;
        }
      },
      error: (error) {
        _lastError = error;
      },
    );
    notifyListeners();
    return result;
  }

  // Order management
  Future<Result<Order?>> getOrderById(String orderId) async {
    return await _repository.getOrderById(orderId);
  }

  Future<Result<void>> addOrder(Order order) async {
    _lastError = null;
    notifyListeners();

    final result = await _repository.addOrder(order);
    result.when(
      success: (_) {
        // Add order to local list immediately for UI responsiveness
        // The stream will also update the list, but this ensures immediate feedback
        if (!_orders.any((existingOrder) => existingOrder.id == order.id)) {
          _orders.add(order);
          notifyListeners();
        }
      },
      error: (error) {
        _lastError = error;
      },
    );
    notifyListeners();
    return result;
  }

  Future<Result<void>> clearOrders() async {
    _lastError = null;
    notifyListeners();

    final result = await _repository.clearOrders();
    result.when(
      success: (_) {
        _orders.clear();
      },
      error: (error) {
        _lastError = error;
      },
    );
    notifyListeners();
    return result;
  }

  // PoC testing methods
  Future<Result<void>> pingServer() async {
    _lastError = null;
    notifyListeners();

    final result = await _repository.pingServer();
    result.when(
      success: (_) {
        // Pong will be received via stream
      },
      error: (error) {
        _lastError = error;
      },
    );
    notifyListeners();
    return result;
  }

  Future<Result<void>> requestConnectionStats() async {
    _lastError = null;
    notifyListeners();

    final result = await _repository.requestConnectionStats();
    result.when(
      success: (_) {
        // Stats will be received via stream
      },
      error: (error) {
        _lastError = error;
      },
    );
    notifyListeners();
    return result;
  }

  Future<Result<void>> runStabilityTest() async {
    _isTesting = true;
    _lastError = null;
    notifyListeners();

    try {
      // Simulate 30-second stability test
      await Future.delayed(const Duration(seconds: 30));

      if (_isConnected) {
        _isTesting = false;
        notifyListeners();
        return const Success(null);
      } else {
        _isTesting = false;
        _lastError = 'Connection lost during stability test';
        notifyListeners();
        return const ErrorResult('Connection lost during stability test');
      }
    } catch (e) {
      _isTesting = false;
      _lastError = e.toString();
      notifyListeners();
      return ErrorResult(e.toString());
    }
  }
}
