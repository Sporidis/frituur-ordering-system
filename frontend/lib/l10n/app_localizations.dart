import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_nl.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale) : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate = _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates = <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('nl')
  ];

  /// The title of the application
  ///
  /// In en, this message translates to:
  /// **'Frituur Ordering System'**
  String get appTitle;

  /// Menu section title
  ///
  /// In en, this message translates to:
  /// **'Menu'**
  String get menu;

  /// Shopping cart section title
  ///
  /// In en, this message translates to:
  /// **'Cart'**
  String get cart;

  /// Order section title
  ///
  /// In en, this message translates to:
  /// **'Order'**
  String get order;

  /// Fries menu item
  ///
  /// In en, this message translates to:
  /// **'Fries'**
  String get fries;

  /// Price label
  ///
  /// In en, this message translates to:
  /// **'Price'**
  String get price;

  /// Add to cart button text
  ///
  /// In en, this message translates to:
  /// **'Add to Cart'**
  String get addToCart;

  /// Language selection label
  ///
  /// In en, this message translates to:
  /// **'Language'**
  String get language;

  /// English language option
  ///
  /// In en, this message translates to:
  /// **'English'**
  String get english;

  /// Dutch language option
  ///
  /// In en, this message translates to:
  /// **'Dutch'**
  String get dutch;

  /// Welcome message
  ///
  /// In en, this message translates to:
  /// **'Welcome to our Frituur!'**
  String get welcome;

  /// Language selection prompt
  ///
  /// In en, this message translates to:
  /// **'Select Language'**
  String get selectLanguage;

  /// Total price label
  ///
  /// In en, this message translates to:
  /// **'Total'**
  String get total;

  /// Checkout button text
  ///
  /// In en, this message translates to:
  /// **'Checkout'**
  String get checkout;

  /// Burger menu item
  ///
  /// In en, this message translates to:
  /// **'Burger'**
  String get burger;

  /// Drinks menu item
  ///
  /// In en, this message translates to:
  /// **'Drinks'**
  String get drinks;

  /// Add to cart snackbar text
  ///
  /// In en, this message translates to:
  /// **'added to cart'**
  String get addedToCart;

  /// WebSocket connection status when connected
  ///
  /// In en, this message translates to:
  /// **'Connected to Backend'**
  String get connectedToBackend;

  /// WebSocket connection status when disconnected
  ///
  /// In en, this message translates to:
  /// **'Disconnected'**
  String get disconnected;

  /// WebSocket controls section title
  ///
  /// In en, this message translates to:
  /// **'WebSocket Controls'**
  String get websocketControls;

  /// Connect button text
  ///
  /// In en, this message translates to:
  /// **'Connect'**
  String get connect;

  /// Disconnect button text
  ///
  /// In en, this message translates to:
  /// **'Disconnect'**
  String get disconnect;

  /// Order management section title
  ///
  /// In en, this message translates to:
  /// **'Order Management'**
  String get orderManagement;

  /// Customer name input label
  ///
  /// In en, this message translates to:
  /// **'Customer Name'**
  String get customerName;

  /// Create sample order button text
  ///
  /// In en, this message translates to:
  /// **'Create Sample Order'**
  String get createSampleOrder;

  /// Create multiple sample orders button text
  ///
  /// In en, this message translates to:
  /// **'Create Multiple Sample Orders'**
  String get createMultipleSampleOrders;

  /// Order selection prompt
  ///
  /// In en, this message translates to:
  /// **'Select Order to Track:'**
  String get selectOrderToTrack;

  /// Order dropdown placeholder
  ///
  /// In en, this message translates to:
  /// **'Choose an order'**
  String get chooseAnOrder;

  /// Join order room button text
  ///
  /// In en, this message translates to:
  /// **'Join Order Room'**
  String get joinOrderRoom;

  /// Leave order room button text
  ///
  /// In en, this message translates to:
  /// **'Leave Order Room'**
  String get leaveOrderRoom;

  /// Real-time status updates section title
  ///
  /// In en, this message translates to:
  /// **'Real-time Status Updates'**
  String get realTimeStatusUpdates;

  /// Message when no status updates are available
  ///
  /// In en, this message translates to:
  /// **'No status updates yet. Create an order and join its room to see real-time updates.'**
  String get noStatusUpdatesYet;

  /// Order label in status update
  ///
  /// In en, this message translates to:
  /// **'Order:'**
  String get orderLabel;

  /// Status label in status update
  ///
  /// In en, this message translates to:
  /// **'Status:'**
  String get statusLabel;

  /// Message label in status update
  ///
  /// In en, this message translates to:
  /// **'Message:'**
  String get messageLabel;

  /// Time label in status update
  ///
  /// In en, this message translates to:
  /// **'Time:'**
  String get timeLabel;

  /// Kitchen simulation section title
  ///
  /// In en, this message translates to:
  /// **'Kitchen Simulation'**
  String get kitchenSimulation;

  /// Simulate kitchen workflow button text
  ///
  /// In en, this message translates to:
  /// **'Simulate Kitchen Workflow'**
  String get simulateKitchenWorkflow;

  /// Order created success message
  ///
  /// In en, this message translates to:
  /// **'Order created: {orderId}'**
  String orderCreated(String orderId);

  /// Multiple orders created success message
  ///
  /// In en, this message translates to:
  /// **'Created {count} sample orders'**
  String createdSampleOrders(int count);

  /// Kitchen workflow started success message
  ///
  /// In en, this message translates to:
  /// **'Kitchen workflow started'**
  String get kitchenWorkflowStarted;

  /// Kitchen workflow failed error message
  ///
  /// In en, this message translates to:
  /// **'Failed to start kitchen workflow'**
  String get failedToStartKitchenWorkflow;

  /// Order creation error message
  ///
  /// In en, this message translates to:
  /// **'Error creating order: {error}'**
  String errorCreatingOrder(String error);

  /// Sample orders creation error message
  ///
  /// In en, this message translates to:
  /// **'Error creating sample orders: {error}'**
  String errorCreatingSampleOrders(String error);

  /// Generic error message
  ///
  /// In en, this message translates to:
  /// **'Error: {error}'**
  String errorGeneric(String error);

  /// Order status update notification
  ///
  /// In en, this message translates to:
  /// **'Order {orderId}: {status}'**
  String orderStatusUpdate(String orderId, String status);

  /// Order status: pending
  ///
  /// In en, this message translates to:
  /// **'Pending'**
  String get statusPending;

  /// Order status: in progress
  ///
  /// In en, this message translates to:
  /// **'In Progress'**
  String get statusInProgress;

  /// Order status: ready
  ///
  /// In en, this message translates to:
  /// **'Ready'**
  String get statusReady;

  /// Order status: completed
  ///
  /// In en, this message translates to:
  /// **'Completed'**
  String get statusCompleted;

  /// Message when kitchen starts preparing order
  ///
  /// In en, this message translates to:
  /// **'Kitchen started preparing your order'**
  String get kitchenStartedPreparing;

  /// Message when order is ready for pickup
  ///
  /// In en, this message translates to:
  /// **'Your order is ready for pickup!'**
  String get orderReadyForPickup;

  /// Message when order status changes to pending
  ///
  /// In en, this message translates to:
  /// **'Order status changed to pending'**
  String get statusChangedToPending;

  /// Message when order status changes to in progress
  ///
  /// In en, this message translates to:
  /// **'Order status changed to in progress'**
  String get statusChangedToInProgress;

  /// Message when order status changes to ready
  ///
  /// In en, this message translates to:
  /// **'Order status changed to ready'**
  String get statusChangedToReady;

  /// Message when order status changes to completed
  ///
  /// In en, this message translates to:
  /// **'Order status changed to completed'**
  String get statusChangedToCompleted;

  /// Payment proof of concept page title
  ///
  /// In en, this message translates to:
  /// **'Payment PoC'**
  String get paymentPoc;

  /// Payment details section title
  ///
  /// In en, this message translates to:
  /// **'Payment Details'**
  String get paymentDetails;

  /// Amount input field label
  ///
  /// In en, this message translates to:
  /// **'Amount (€)'**
  String get amount;

  /// Amount validation error message
  ///
  /// In en, this message translates to:
  /// **'Please enter an amount'**
  String get pleaseEnterAmount;

  /// Valid amount validation error message
  ///
  /// In en, this message translates to:
  /// **'Please enter a valid amount'**
  String get pleaseEnterValidAmount;

  /// Customer name validation error message
  ///
  /// In en, this message translates to:
  /// **'Please enter customer name'**
  String get pleaseEnterCustomerName;

  /// Order ID input field label
  ///
  /// In en, this message translates to:
  /// **'Order ID'**
  String get orderId;

  /// Order ID validation error message
  ///
  /// In en, this message translates to:
  /// **'Please enter order ID'**
  String get pleaseEnterOrderId;

  /// Creating payment intent loading text
  ///
  /// In en, this message translates to:
  /// **'Creating...'**
  String get creating;

  /// Create payment intent button text
  ///
  /// In en, this message translates to:
  /// **'Create Payment Intent'**
  String get createPaymentIntent;

  /// Create demo payment button text
  ///
  /// In en, this message translates to:
  /// **'Create Demo Payment (€19.99)'**
  String get createDemoPayment;

  /// Payment intent created section title
  ///
  /// In en, this message translates to:
  /// **'Payment Intent Created'**
  String get paymentIntentCreated;

  /// ID label
  ///
  /// In en, this message translates to:
  /// **'ID:'**
  String get id;

  /// Amount label
  ///
  /// In en, this message translates to:
  /// **'Amount:'**
  String get amountLabel;

  /// Currency label
  ///
  /// In en, this message translates to:
  /// **'Currency:'**
  String get currency;

  /// Status label
  ///
  /// In en, this message translates to:
  /// **'Status:'**
  String get status;

  /// Processing payment loading text
  ///
  /// In en, this message translates to:
  /// **'Processing...'**
  String get processing;

  /// Process payment button text
  ///
  /// In en, this message translates to:
  /// **'Process Payment'**
  String get processPayment;

  /// Payment result section title
  ///
  /// In en, this message translates to:
  /// **'Payment Result'**
  String get paymentResult;

  /// Test card numbers section title
  ///
  /// In en, this message translates to:
  /// **'Test Card Numbers'**
  String get testCardNumbers;

  /// Test card numbers instruction text
  ///
  /// In en, this message translates to:
  /// **'Use these test card numbers for testing:'**
  String get useTestCardNumbers;

  /// Visa test card number
  ///
  /// In en, this message translates to:
  /// **'• Visa: 4242424242424242'**
  String get visaTestCard;

  /// Mastercard test card number
  ///
  /// In en, this message translates to:
  /// **'• Mastercard: 5555555555554444'**
  String get mastercardTestCard;

  /// Declined test card number
  ///
  /// In en, this message translates to:
  /// **'• Declined: 4000000000000002'**
  String get declinedTestCard;

  /// Test card date and CVC instructions
  ///
  /// In en, this message translates to:
  /// **'• Any future date, any CVC'**
  String get testCardInstructions;

  /// Stripe initialization error message
  ///
  /// In en, this message translates to:
  /// **'Failed to initialize Stripe: {error}'**
  String failedToInitializeStripe(String error);

  /// Payment intent created success message
  ///
  /// In en, this message translates to:
  /// **'Payment intent created: {id}'**
  String paymentIntentCreatedSuccess(String id);

  /// Payment intent creation failure message
  ///
  /// In en, this message translates to:
  /// **'Failed to create payment intent'**
  String get failedToCreatePaymentIntent;

  /// Payment success message
  ///
  /// In en, this message translates to:
  /// **'Payment successful! 🎉'**
  String get paymentSuccessful;

  /// Payment failure message
  ///
  /// In en, this message translates to:
  /// **'Payment failed: {error}'**
  String paymentFailed(String error);

  /// Payment processing error message
  ///
  /// In en, this message translates to:
  /// **'Error processing payment: {error}'**
  String errorProcessingPayment(String error);

  /// Demo payment intent created success message
  ///
  /// In en, this message translates to:
  /// **'Demo payment intent created: {id}'**
  String demoPaymentIntentCreated(String id);

  /// Demo payment creation failure message
  ///
  /// In en, this message translates to:
  /// **'Failed to create demo payment'**
  String get failedToCreateDemoPayment;

  /// Default customer name
  ///
  /// In en, this message translates to:
  /// **'Customer'**
  String get customer;

  /// Proof of concepts page title
  ///
  /// In en, this message translates to:
  /// **'PoCs'**
  String get pocs;

  /// Description text for PoC selection
  ///
  /// In en, this message translates to:
  /// **'Select a PoC to test different features of the Frituur Ordering System'**
  String get selectPocToTest;

  /// Title for internationalization PoC
  ///
  /// In en, this message translates to:
  /// **'PoC 1: i18n'**
  String get poc1I18n;

  /// Description for internationalization PoC
  ///
  /// In en, this message translates to:
  /// **'Internationalization\n(Dutch/English)'**
  String get poc1I18nDescription;

  /// Message when clicking on i18n PoC
  ///
  /// In en, this message translates to:
  /// **'i18n is integrated in all PoCs'**
  String get i18nIntegratedInAllPocs;

  /// Title for WebSocket PoC
  ///
  /// In en, this message translates to:
  /// **'PoC 2: WebSocket'**
  String get poc2Websocket;

  /// Description for WebSocket PoC
  ///
  /// In en, this message translates to:
  /// **'Real-time Order Updates\n& Kitchen Simulation'**
  String get poc2WebsocketDescription;

  /// Title for Stripe payment PoC
  ///
  /// In en, this message translates to:
  /// **'PoC 3: Stripe'**
  String get poc3Stripe;

  /// Description for Stripe payment PoC
  ///
  /// In en, this message translates to:
  /// **'Payment Processing\n& Card Payments'**
  String get poc3StripeDescription;

  /// Title for modular architecture PoC
  ///
  /// In en, this message translates to:
  /// **'PoC 4: Modular'**
  String get poc4Modular;

  /// Description for modular architecture PoC
  ///
  /// In en, this message translates to:
  /// **'Clean Architecture\n& Module Boundaries'**
  String get poc4ModularDescription;

  /// Coming soon badge text
  ///
  /// In en, this message translates to:
  /// **'COMING SOON'**
  String get comingSoon;

  /// Message when clicking on modular PoC
  ///
  /// In en, this message translates to:
  /// **'Coming Soon: Modular Monolith PoC'**
  String get comingSoonModularPoc;

  /// Section title for PoC testing controls
  ///
  /// In en, this message translates to:
  /// **'PoC Testing'**
  String get pocTesting;

  /// Ping button label
  ///
  /// In en, this message translates to:
  /// **'Ping'**
  String get ping;

  /// Stats button label
  ///
  /// In en, this message translates to:
  /// **'Stats'**
  String get stats;

  /// Stability test button label
  ///
  /// In en, this message translates to:
  /// **'Stability Test'**
  String get stabilityTest;

  /// Loading label while testing
  ///
  /// In en, this message translates to:
  /// **'Testing...'**
  String get testingEllipsis;

  /// Title for last pong info card
  ///
  /// In en, this message translates to:
  /// **'Last Pong'**
  String get lastPong;

  /// Title for connection stats info card
  ///
  /// In en, this message translates to:
  /// **'Connection Stats'**
  String get connectionStatsTitle;

  /// Snackbar: ping sent
  ///
  /// In en, this message translates to:
  /// **'🏓 Ping sent to server'**
  String get pingSentToServer;

  /// Snackbar: requesting stats
  ///
  /// In en, this message translates to:
  /// **'📊 Requesting connection statistics...'**
  String get requestingConnectionStatistics;

  /// Snackbar: starting stability test
  ///
  /// In en, this message translates to:
  /// **'🧪 Starting 30-second stability test...'**
  String get startingStabilityTest;

  /// Snackbar: stability test completed
  ///
  /// In en, this message translates to:
  /// **'✅ Stability test completed'**
  String get stabilityTestCompleted;

  /// Snackbar: connection lost during stability test
  ///
  /// In en, this message translates to:
  /// **'❌ Connection lost during stability test'**
  String get connectionLostDuringStabilityTest;

  /// Label showing the current language name
  ///
  /// In en, this message translates to:
  /// **'Current Language: {language}'**
  String currentLanguage(String language);

  /// Active connections label
  ///
  /// In en, this message translates to:
  /// **'Active:'**
  String get statsActive;

  /// Total connections label
  ///
  /// In en, this message translates to:
  /// **'Total:'**
  String get statsTotal;

  /// Max concurrent connections label
  ///
  /// In en, this message translates to:
  /// **'Max:'**
  String get statsMax;

  /// Refund button label
  ///
  /// In en, this message translates to:
  /// **'Refund'**
  String get refund;

  /// Hint text for optional refund amount
  ///
  /// In en, this message translates to:
  /// **'Optional: specify refund amount (defaults to full)'**
  String get optionalRefundAmountHint;

  /// Refund success message
  ///
  /// In en, this message translates to:
  /// **'Refund successful'**
  String get refundSuccessful;

  /// Refund failure message
  ///
  /// In en, this message translates to:
  /// **'Refund failed'**
  String get refundFailed;
}

class _AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) => <String>['en', 'nl'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {


  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en': return AppLocalizationsEn();
    case 'nl': return AppLocalizationsNl();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.'
  );
}
