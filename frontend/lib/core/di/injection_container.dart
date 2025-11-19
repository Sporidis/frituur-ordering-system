import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

// Core
import '../mod.dart';

// Features
import '../../features/auth/mod.dart';
import '../../features/websocket/mod.dart';
import '../../features/payment/mod.dart';
import '../../features/order/mod.dart';


// Implementation imports (not exported in barrel files)
import '../../features/auth/data/datasources/auth_remote_datasource_impl.dart';
import '../../features/auth/data/datasources/auth_local_datasource_impl.dart';
import '../../features/websocket/data/datasources/websocket_datasource_impl.dart';
import '../../features/payment/data/datasources/payment_remote_datasource_impl.dart';
import '../../features/order/data/datasources/order_remote_datasource_impl.dart';

final getIt = GetIt.instance;

/// Initialize dependency injection container
Future<void> setupDependencyInjection() async {
  // ============================================
  // Core Dependencies
  // ============================================

  // SharedPreferences (singleton)
  final sharedPreferences = await SharedPreferences.getInstance();
  getIt.registerLazySingleton<SharedPreferences>(() => sharedPreferences);

  // HTTP Client (singleton)
  getIt.registerLazySingleton<http.Client>(() => http.Client());

  // App Config (singleton)
  getIt.registerLazySingleton<AppConfig>(() => AppConfig());

  // ============================================
  // Data Sources
  // ============================================

  // Auth
  getIt.registerLazySingleton<AuthLocalDataSource>(
    () => AuthLocalDataSourceImpl(getIt<SharedPreferences>()),
  );
  getIt.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(getIt<http.Client>(), getIt<AppConfig>()),
  );

  // WebSocket
  getIt.registerLazySingleton<WebSocketDataSource>(
    () => WebSocketDataSourceImpl(getIt<AppConfig>()),
  );

  // Payment
  getIt.registerLazySingleton<PaymentRemoteDataSource>(
    () => PaymentRemoteDataSourceImpl(getIt<http.Client>(), getIt<AppConfig>()),
  );

  // Order
  getIt.registerLazySingleton<OrderRemoteDataSource>(
    () => OrderRemoteDataSourceImpl(getIt<http.Client>(), getIt<AppConfig>()),
  );

  // ============================================
  // Repositories
  // ============================================

  // Auth
  getIt.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(
      getIt<AuthRemoteDataSource>(),
      getIt<AuthLocalDataSource>(),
    ),
  );

  // WebSocket
  getIt.registerLazySingleton<WebSocketRepository>(
    () => WebSocketRepositoryImpl(getIt<WebSocketDataSource>()),
  );

  // Payment
  getIt.registerLazySingleton<PaymentRepository>(
    () => PaymentRepositoryImpl(getIt<PaymentRemoteDataSource>()),
  );

  // Order
  getIt.registerLazySingleton<OrderRepository>(
    () => OrderRepositoryImpl(getIt<OrderRemoteDataSource>()),
  );

  // ============================================
  // Use Cases
  // ============================================

  // Auth
  getIt.registerLazySingleton(() => LoginUseCase(getIt<AuthRepository>()));
  getIt.registerLazySingleton(() => LogoutUseCase(getIt<AuthRepository>()));
  getIt.registerLazySingleton(
    () => GetAuthStatusUseCase(getIt<AuthRepository>()),
  );

  // WebSocket
  getIt.registerLazySingleton(
    () => ConnectWebSocketUseCase(getIt<WebSocketRepository>()),
  );
  getIt.registerLazySingleton(
    () => DisconnectWebSocketUseCase(getIt<WebSocketRepository>()),
  );
  getIt.registerLazySingleton(
    () => JoinOrderRoomUseCase(getIt<WebSocketRepository>()),
  );
  getIt.registerLazySingleton(
    () => PingServerUseCase(getIt<WebSocketRepository>()),
  );

  // Payment
  getIt.registerLazySingleton(
    () => InitializeStripeUseCase(getIt<PaymentRemoteDataSource>()),
  );
  getIt.registerLazySingleton(
    () => CreatePaymentIntentUseCase(getIt<PaymentRepository>()),
  );
  getIt.registerLazySingleton(
    () => ProcessPaymentUseCase(getIt<PaymentRepository>()),
  );
  getIt.registerLazySingleton(
    () => RefundPaymentUseCase(getIt<PaymentRepository>()),
  );
  getIt.registerLazySingleton(
    () => GetPaymentIntentUseCase(getIt<PaymentRepository>()),
  );

  // Order
  getIt.registerLazySingleton(
    () => CreateOrderUseCase(getIt<OrderRepository>()),
  );
  getIt.registerLazySingleton(
    () => GetAllOrdersUseCase(getIt<OrderRepository>()),
  );
  getIt.registerLazySingleton(
    () => CreateSampleOrdersUseCase(getIt<OrderRepository>()),
  );
  getIt.registerLazySingleton(
    () => SimulateKitchenWorkflowUseCase(getIt<OrderRepository>()),
  );

  // ============================================
  // Providers (State Management)
  // ============================================

  // Auth Provider
  getIt.registerFactory(
    () => AuthProvider(
      loginUseCase: getIt<LoginUseCase>(),
      logoutUseCase: getIt<LogoutUseCase>(),
      getAuthStatusUseCase: getIt<GetAuthStatusUseCase>(),
    ),
  );

  // Language Provider
  getIt.registerLazySingleton(() => LanguageProvider());
}
