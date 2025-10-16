// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appTitle => 'Frituur Ordering System';

  @override
  String get menu => 'Menu';

  @override
  String get cart => 'Cart';

  @override
  String get order => 'Order';

  @override
  String get fries => 'Fries';

  @override
  String get price => 'Price';

  @override
  String get addToCart => 'Add to Cart';

  @override
  String get language => 'Language';

  @override
  String get english => 'English';

  @override
  String get dutch => 'Dutch';

  @override
  String get welcome => 'Welcome to our Frituur!';

  @override
  String get selectLanguage => 'Select Language';

  @override
  String get total => 'Total';

  @override
  String get checkout => 'Checkout';

  @override
  String get burger => 'Burger';

  @override
  String get drinks => 'Drinks';

  @override
  String get addedToCart => 'added to cart';

  @override
  String get connectedToBackend => 'Connected to Backend';

  @override
  String get disconnected => 'Disconnected';

  @override
  String get websocketControls => 'WebSocket Controls';

  @override
  String get connect => 'Connect';

  @override
  String get disconnect => 'Disconnect';

  @override
  String get orderManagement => 'Order Management';

  @override
  String get customerName => 'Customer Name';

  @override
  String get createSampleOrder => 'Create Sample Order';

  @override
  String get createMultipleSampleOrders => 'Create Multiple Sample Orders';

  @override
  String get selectOrderToTrack => 'Select Order to Track:';

  @override
  String get chooseAnOrder => 'Choose an order';

  @override
  String get joinOrderRoom => 'Join Order Room';

  @override
  String get leaveOrderRoom => 'Leave Order Room';

  @override
  String get realTimeStatusUpdates => 'Real-time Status Updates';

  @override
  String get noStatusUpdatesYet => 'No status updates yet. Create an order and join its room to see real-time updates.';

  @override
  String get orderLabel => 'Order:';

  @override
  String get statusLabel => 'Status:';

  @override
  String get messageLabel => 'Message:';

  @override
  String get timeLabel => 'Time:';

  @override
  String get kitchenSimulation => 'Kitchen Simulation';

  @override
  String get simulateKitchenWorkflow => 'Simulate Kitchen Workflow';

  @override
  String orderCreated(String orderId) {
    return 'Order created: $orderId';
  }

  @override
  String createdSampleOrders(int count) {
    return 'Created $count sample orders';
  }

  @override
  String get kitchenWorkflowStarted => 'Kitchen workflow started';

  @override
  String get failedToStartKitchenWorkflow => 'Failed to start kitchen workflow';

  @override
  String errorCreatingOrder(String error) {
    return 'Error creating order: $error';
  }

  @override
  String errorCreatingSampleOrders(String error) {
    return 'Error creating sample orders: $error';
  }

  @override
  String errorGeneric(String error) {
    return 'Error: $error';
  }

  @override
  String orderStatusUpdate(String orderId, String status) {
    return 'Order $orderId: $status';
  }

  @override
  String get statusPending => 'Pending';

  @override
  String get statusInProgress => 'In Progress';

  @override
  String get statusReady => 'Ready';

  @override
  String get statusCompleted => 'Completed';

  @override
  String get kitchenStartedPreparing => 'Kitchen started preparing your order';

  @override
  String get orderReadyForPickup => 'Your order is ready for pickup!';

  @override
  String get statusChangedToPending => 'Order status changed to pending';

  @override
  String get statusChangedToInProgress => 'Order status changed to in progress';

  @override
  String get statusChangedToReady => 'Order status changed to ready';

  @override
  String get statusChangedToCompleted => 'Order status changed to completed';

  @override
  String get paymentPoc => 'Payment PoC';

  @override
  String get paymentDetails => 'Payment Details';

  @override
  String get amount => 'Amount (€)';

  @override
  String get pleaseEnterAmount => 'Please enter an amount';

  @override
  String get pleaseEnterValidAmount => 'Please enter a valid amount';

  @override
  String get pleaseEnterCustomerName => 'Please enter customer name';

  @override
  String get orderId => 'Order ID';

  @override
  String get pleaseEnterOrderId => 'Please enter order ID';

  @override
  String get creating => 'Creating...';

  @override
  String get createPaymentIntent => 'Create Payment Intent';

  @override
  String get createDemoPayment => 'Create Demo Payment (€19.99)';

  @override
  String get paymentIntentCreated => 'Payment Intent Created';

  @override
  String get id => 'ID:';

  @override
  String get amountLabel => 'Amount:';

  @override
  String get currency => 'Currency:';

  @override
  String get status => 'Status:';

  @override
  String get processing => 'Processing...';

  @override
  String get processPayment => 'Process Payment';

  @override
  String get paymentResult => 'Payment Result';

  @override
  String get testCardNumbers => 'Test Card Numbers';

  @override
  String get useTestCardNumbers => 'Use these test card numbers for testing:';

  @override
  String get visaTestCard => '• Visa: 4242424242424242';

  @override
  String get mastercardTestCard => '• Mastercard: 5555555555554444';

  @override
  String get declinedTestCard => '• Declined: 4000000000000002';

  @override
  String get testCardInstructions => '• Any future date, any CVC';

  @override
  String failedToInitializeStripe(String error) {
    return 'Failed to initialize Stripe: $error';
  }

  @override
  String paymentIntentCreatedSuccess(String id) {
    return 'Payment intent created: $id';
  }

  @override
  String get failedToCreatePaymentIntent => 'Failed to create payment intent';

  @override
  String get paymentSuccessful => 'Payment successful! 🎉';

  @override
  String paymentFailed(String error) {
    return 'Payment failed: $error';
  }

  @override
  String errorProcessingPayment(String error) {
    return 'Error processing payment: $error';
  }

  @override
  String demoPaymentIntentCreated(String id) {
    return 'Demo payment intent created: $id';
  }

  @override
  String get failedToCreateDemoPayment => 'Failed to create demo payment';

  @override
  String get customer => 'Customer';

  @override
  String get pocs => 'PoCs';

  @override
  String get selectPocToTest => 'Select a PoC to test different features of the Frituur Ordering System';

  @override
  String get poc1I18n => 'PoC 1: i18n';

  @override
  String get poc1I18nDescription => 'Internationalization\n(Dutch/English)';

  @override
  String get i18nIntegratedInAllPocs => 'i18n is integrated in all PoCs';

  @override
  String get poc2Websocket => 'PoC 2: WebSocket';

  @override
  String get poc2WebsocketDescription => 'Real-time Order Updates\n& Kitchen Simulation';

  @override
  String get poc3Stripe => 'PoC 3: Stripe';

  @override
  String get poc3StripeDescription => 'Payment Processing\n& Card Payments';

  @override
  String get poc4Modular => 'PoC 4: Modular';

  @override
  String get poc4ModularDescription => 'Clean Architecture\n& Module Boundaries';

  @override
  String get comingSoon => 'COMING SOON';

  @override
  String get comingSoonModularPoc => 'Coming Soon: Modular Monolith PoC';
}
