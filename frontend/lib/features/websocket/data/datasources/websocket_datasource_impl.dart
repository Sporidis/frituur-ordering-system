import 'dart:async';
import 'package:socket_io_client/socket_io_client.dart' as io;
import '../../../../core/mod.dart';
import '../../../order/domain/entities.dart' show Order, OrderStatusUpdate;
import '../../domain/entities.dart';
import 'websocket_datasource.dart';

class WebSocketDataSourceImpl implements WebSocketDataSource {
  final AppConfig _config;
  io.Socket? _socket;
  String? _currentOrderId;

  final StreamController<bool> _connectionController =
      StreamController<bool>.broadcast();
  final StreamController<Order> _newOrderController =
      StreamController<Order>.broadcast();
  final StreamController<OrderStatusUpdate> _orderStatusController =
      StreamController<OrderStatusUpdate>.broadcast();
  final StreamController<ServerPong> _pongController =
      StreamController<ServerPong>.broadcast();
  final StreamController<ConnectionStats> _connectionStatsController =
      StreamController<ConnectionStats>.broadcast();

  WebSocketDataSourceImpl(this._config);

  @override
  bool get isConnected => _socket?.connected ?? false;

  @override
  Stream<bool> get connectionStream => _connectionController.stream;

  @override
  String? get currentOrderId => _currentOrderId;

  @override
  Stream<Order> get newOrderStream => _newOrderController.stream;

  @override
  Stream<OrderStatusUpdate> get orderStatusStream =>
      _orderStatusController.stream;

  @override
  Stream<ServerPong> get pongStream => _pongController.stream;

  @override
  Stream<ConnectionStats> get connectionStatsStream =>
      _connectionStatsController.stream;

  @override
  Future<void> connect() async {
    try {
      _socket = io.io(_config.webSocketUrl, <String, dynamic>{
        'transports': ['websocket', 'polling'],
        'autoConnect': false,
        'reconnection': true,
        'reconnectionAttempts': 5,
        'reconnectionDelay': 1000,
        'timeout': 20000,
      });

      _setupEventListeners();
      _socket!.connect();

      Logger.info('WebSocket: Attempting to connect...');
    } catch (e) {
      Logger.error('WebSocket connection error', e);
      rethrow;
    }
  }

  @override
  Future<void> disconnect() async {
    if (_socket != null) {
      _socket!.disconnect();
      _socket = null;
      _currentOrderId = null;
      _connectionController.add(false);
      Logger.info('WebSocket: Disconnected');
    }
  }

  void _setupEventListeners() {
    _socket!.onConnect((_) {
      _connectionController.add(true);
      Logger.info('WebSocket: Connected successfully');

      if (_currentOrderId != null) {
        joinOrderRoom(_currentOrderId!);
      }
    });

    _socket!.onDisconnect((_) {
      _connectionController.add(false);
      Logger.warning('WebSocket: Disconnected');
    });

    _socket!.onConnectError((error) {
      Logger.error('WebSocket connection error', error);
      _connectionController.add(false);
    });

    _socket!.on('joined_order_room', (data) {
      Logger.debug('WebSocket: Joined order room: $data');
    });

    _socket!.on('order_status_updated', (data) {
      Logger.debug('WebSocket: Order status update received: $data');
      try {
        final update = OrderStatusUpdate.fromJson(data);
        _orderStatusController.add(update);
      } catch (e) {
        Logger.error('Error parsing order status update', e);
      }
    });

    _socket!.on('new_order', (data) {
      Logger.info('WebSocket: New order received: $data');
      try {
        final orderData =
            data is Map<String, dynamic> && data.containsKey('order')
            ? data['order'] as Map<String, dynamic>
            : data as Map<String, dynamic>;
        final order = Order.fromJson(orderData);
        _newOrderController.add(order);
      } catch (e, st) {
        Logger.error('Error parsing new order', e, st);
      }
    });

    _socket!.on('connection_confirmed', (data) {
      Logger.debug('WebSocket: Connection confirmed: $data');
    });

    _socket!.on('server_pong', (data) {
      Logger.debug('WebSocket: Pong received: $data');
      if (data is Map<String, dynamic>) {
        try {
          _pongController.add(ServerPong.fromJson(data));
        } catch (e) {
          Logger.error('Error parsing server pong', e);
        }
      }
    });

    _socket!.on('connection_stats', (data) {
      Logger.debug('WebSocket: Connection stats received: $data');
      if (data is Map<String, dynamic>) {
        try {
          _connectionStatsController.add(ConnectionStats.fromJson(data));
        } catch (e) {
          Logger.error('Error parsing connection stats', e);
        }
      }
    });
  }

  @override
  Future<void> joinOrderRoom(String orderId) async {
    if (_socket != null && isConnected) {
      _currentOrderId = orderId;
      _socket!.emit('join_order_room', {'orderId': orderId});
      Logger.debug('WebSocket: Joining order room: $orderId');
    }
  }

  @override
  Future<void> leaveOrderRoom(String orderId) async {
    if (_socket != null && isConnected) {
      _socket!.emit('leave_order_room', {'orderId': orderId});
      if (_currentOrderId == orderId) {
        _currentOrderId = null;
      }
      Logger.debug('WebSocket: Leaving order room: $orderId');
    }
  }

  @override
  Future<void> pingServer() async {
    if (_socket != null && isConnected) {
      _socket!.emit('client_ping');
      Logger.debug('WebSocket: Ping sent to server');
    }
  }

  @override
  Future<void> requestConnectionStats() async {
    if (_socket != null && isConnected) {
      _socket!.emit('get_connection_stats');
      Logger.debug('WebSocket: Requesting connection statistics');
    }
  }

  void dispose() {
    disconnect();
    _connectionController.close();
    _newOrderController.close();
    _orderStatusController.close();
    _pongController.close();
    _connectionStatsController.close();
  }
}
