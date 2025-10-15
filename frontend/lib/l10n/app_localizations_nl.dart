// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Dutch Flemish (`nl`).
class AppLocalizationsNl extends AppLocalizations {
  AppLocalizationsNl([String locale = 'nl']) : super(locale);

  @override
  String get appTitle => 'Frituur Bestelsysteem';

  @override
  String get menu => 'Menu';

  @override
  String get cart => 'Winkelwagen';

  @override
  String get order => 'Bestelling';

  @override
  String get fries => 'Frietjes';

  @override
  String get price => 'Prijs';

  @override
  String get addToCart => 'Toevoegen aan Winkelwagen';

  @override
  String get language => 'Taal';

  @override
  String get english => 'Engels';

  @override
  String get dutch => 'Nederlands';

  @override
  String get welcome => 'Welkom bij onze Frituur!';

  @override
  String get selectLanguage => 'Selecteer Taal';

  @override
  String get total => 'Totaal';

  @override
  String get checkout => 'Afrekenen';

  @override
  String get burger => 'Burger';

  @override
  String get drinks => 'Drankjes';

  @override
  String get addedToCart => 'toegevoegd aan winkelwagen';

  @override
  String get connectedToBackend => 'Verbonden met Backend';

  @override
  String get disconnected => 'Verbroken';

  @override
  String get websocketControls => 'WebSocket Bediening';

  @override
  String get connect => 'Verbinden';

  @override
  String get disconnect => 'Verbreken';

  @override
  String get orderManagement => 'Bestelling Beheer';

  @override
  String get customerName => 'Klantnaam';

  @override
  String get createSampleOrder => 'Maak Voorbeeldbestelling';

  @override
  String get createMultipleSampleOrders => 'Maak Meerdere Voorbeeldbestellingen';

  @override
  String get selectOrderToTrack => 'Selecteer Bestelling om te Volgen:';

  @override
  String get chooseAnOrder => 'Kies een bestelling';

  @override
  String get joinOrderRoom => 'Ga naar Bestelling Kamer';

  @override
  String get leaveOrderRoom => 'Verlaat Bestelling Kamer';

  @override
  String get realTimeStatusUpdates => 'Real-time Status Updates';

  @override
  String get noStatusUpdatesYet => 'Nog geen status updates. Maak een bestelling en ga naar de kamer om real-time updates te zien.';

  @override
  String get orderLabel => 'Bestelling:';

  @override
  String get statusLabel => 'Status:';

  @override
  String get messageLabel => 'Bericht:';

  @override
  String get timeLabel => 'Tijd:';

  @override
  String get kitchenSimulation => 'Keuken Simulatie';

  @override
  String get simulateKitchenWorkflow => 'Simuleer Keuken Workflow';

  @override
  String orderCreated(String orderId) {
    return 'Bestelling gemaakt: $orderId';
  }

  @override
  String createdSampleOrders(int count) {
    return '$count voorbeeldbestellingen gemaakt';
  }

  @override
  String get kitchenWorkflowStarted => 'Keuken workflow gestart';

  @override
  String get failedToStartKitchenWorkflow => 'Kon keuken workflow niet starten';

  @override
  String errorCreatingOrder(String error) {
    return 'Fout bij maken bestelling: $error';
  }

  @override
  String errorCreatingSampleOrders(String error) {
    return 'Fout bij maken voorbeeldbestellingen: $error';
  }

  @override
  String errorGeneric(String error) {
    return 'Fout: $error';
  }

  @override
  String orderStatusUpdate(String orderId, String status) {
    return 'Bestelling $orderId: $status';
  }

  @override
  String get statusPending => 'In behandeling';

  @override
  String get statusInProgress => 'In voorbereiding';

  @override
  String get statusReady => 'Klaar';

  @override
  String get statusCompleted => 'Voltooid';

  @override
  String get kitchenStartedPreparing => 'Keuken is begonnen met het bereiden van uw bestelling';

  @override
  String get orderReadyForPickup => 'Uw bestelling is klaar voor ophalen!';

  @override
  String get statusChangedToPending => 'Bestelling status gewijzigd naar in behandeling';

  @override
  String get statusChangedToInProgress => 'Bestelling status gewijzigd naar in voorbereiding';

  @override
  String get statusChangedToReady => 'Bestelling status gewijzigd naar klaar';

  @override
  String get statusChangedToCompleted => 'Bestelling status gewijzigd naar voltooid';
}
