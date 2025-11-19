// Re-export OrderStatusUpdate from Order feature since WebSocket uses it

// WebSocket domain entities
// These represent the core business objects for the WebSocket feature

class ServerPong {
  final DateTime timestamp;

  ServerPong({required this.timestamp});

  factory ServerPong.fromJson(Map<String, dynamic> json) {
    final ts = json['timestamp'];
    if (ts is String) {
      return ServerPong(timestamp: DateTime.tryParse(ts) ?? DateTime.now());
    }
    return ServerPong(timestamp: DateTime.now());
  }
}

class ClientInfo {
  final DateTime? connectedAt;
  final DateTime? lastPing;
  final List<String>? rooms;

  ClientInfo({this.connectedAt, this.lastPing, this.rooms});

  factory ClientInfo.fromJson(Map<String, dynamic> json) {
    DateTime? parseDate(dynamic v) {
      if (v is String) return DateTime.tryParse(v);
      return null;
    }

    List<String>? parseRooms(dynamic v) {
      if (v is List) {
        return v.whereType<String>().toList();
      }
      if (v is Map) {
        return v.keys.whereType<String>().toList();
      }
      return null;
    }

    return ClientInfo(
      connectedAt: parseDate(json['connectedAt']),
      lastPing: parseDate(json['lastPing']),
      rooms: parseRooms(json['rooms']),
    );
  }
}

class ConnectionStats {
  final int totalConnections;
  final int activeConnections;
  final int maxConcurrentConnections;
  final ClientInfo? clientInfo;
  final Map<String, int>? orderRooms;

  ConnectionStats({
    required this.totalConnections,
    required this.activeConnections,
    required this.maxConcurrentConnections,
    this.clientInfo,
    this.orderRooms,
  });

  factory ConnectionStats.fromJson(Map<String, dynamic> json) {
    int toInt(dynamic v) {
      if (v is int) return v;
      if (v is num) return v.toInt();
      return 0;
    }

    Map<String, int>? parseOrderRooms(dynamic v) {
      if (v is Map) {
        final result = <String, int>{};
        v.forEach((key, value) {
          if (key is String) {
            result[key] = toInt(value);
          }
        });
        return result;
      }
      return null;
    }

    return ConnectionStats(
      totalConnections: toInt(json['totalConnections']),
      activeConnections: toInt(json['activeConnections']),
      maxConcurrentConnections: toInt(json['maxConcurrentConnections']),
      clientInfo: json['clientInfo'] is Map<String, dynamic>
          ? ClientInfo.fromJson(json['clientInfo'] as Map<String, dynamic>)
          : null,
      orderRooms: parseOrderRooms(json['orderRooms']),
    );
  }
}
