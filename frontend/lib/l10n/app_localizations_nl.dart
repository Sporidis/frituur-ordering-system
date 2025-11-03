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

  @override
  String get paymentPoc => 'Betaling PoC';

  @override
  String get paymentDetails => 'Betalingsgegevens';

  @override
  String get amount => 'Bedrag (€)';

  @override
  String get pleaseEnterAmount => 'Voer een bedrag in';

  @override
  String get pleaseEnterValidAmount => 'Voer een geldig bedrag in';

  @override
  String get pleaseEnterCustomerName => 'Voer klantnaam in';

  @override
  String get orderId => 'Bestelling ID';

  @override
  String get pleaseEnterOrderId => 'Voer bestelling ID in';

  @override
  String get creating => 'Aanmaken...';

  @override
  String get createPaymentIntent => 'Maak Betalingsintentie';

  @override
  String get createDemoPayment => 'Maak Demo Betaling (€19.99)';

  @override
  String get paymentIntentCreated => 'Betalingsintentie Aangemaakt';

  @override
  String get id => 'ID:';

  @override
  String get amountLabel => 'Bedrag:';

  @override
  String get currency => 'Valuta:';

  @override
  String get status => 'Status:';

  @override
  String get processing => 'Verwerken...';

  @override
  String get processPayment => 'Verwerk Betaling';

  @override
  String get paymentResult => 'Betalingsresultaat';

  @override
  String get testCardNumbers => 'Test Kaartnummers';

  @override
  String get useTestCardNumbers => 'Gebruik deze test kaartnummers voor testen:';

  @override
  String get visaTestCard => '• Visa: 4242424242424242';

  @override
  String get mastercardTestCard => '• Mastercard: 5555555555554444';

  @override
  String get declinedTestCard => '• Geweigerd: 4000000000000002';

  @override
  String get testCardInstructions => '• Elke toekomstige datum, elke CVC';

  @override
  String failedToInitializeStripe(String error) {
    return 'Kon Stripe niet initialiseren: $error';
  }

  @override
  String paymentIntentCreatedSuccess(String id) {
    return 'Betalingsintentie aangemaakt: $id';
  }

  @override
  String get failedToCreatePaymentIntent => 'Kon betalingsintentie niet aanmaken';

  @override
  String get paymentSuccessful => 'Betaling succesvol! 🎉';

  @override
  String paymentFailed(String error) {
    return 'Betaling mislukt: $error';
  }

  @override
  String errorProcessingPayment(String error) {
    return 'Fout bij verwerken betaling: $error';
  }

  @override
  String demoPaymentIntentCreated(String id) {
    return 'Demo betalingsintentie aangemaakt: $id';
  }

  @override
  String get failedToCreateDemoPayment => 'Kon demo betaling niet aanmaken';

  @override
  String get customer => 'Klant';

  @override
  String get pocs => 'PoC\'s';

  @override
  String get selectPocToTest => 'Selecteer een PoC om verschillende functies van het Frituur Bestelsysteem te testen';

  @override
  String get poc1I18n => 'PoC 1: i18n';

  @override
  String get poc1I18nDescription => 'Internationalisatie\n(Nederlands/Engels)';

  @override
  String get i18nIntegratedInAllPocs => 'i18n is geïntegreerd in alle PoC\'s';

  @override
  String get poc2Websocket => 'PoC 2: WebSocket';

  @override
  String get poc2WebsocketDescription => 'Real-time Bestelling Updates\n& Keuken Simulatie';

  @override
  String get poc3Stripe => 'PoC 3: Stripe';

  @override
  String get poc3StripeDescription => 'Betalingsverwerking\n& Kaart Betalingen';

  @override
  String get poc4Modular => 'PoC 4: Modulair';

  @override
  String get poc4ModularDescription => 'Schone Architectuur\n& Module Grenzen';

  @override
  String get comingSoon => 'BINNENKORT';

  @override
  String get comingSoonModularPoc => 'Binnenkort: Modulaire Monolith PoC';

  @override
  String get pocTesting => 'PoC Testen';

  @override
  String get ping => 'Ping';

  @override
  String get stats => 'Statistieken';

  @override
  String get stabilityTest => 'Stabiliteitstest';

  @override
  String get testingEllipsis => 'Testen...';

  @override
  String get lastPong => 'Laatste Pong';

  @override
  String get connectionStatsTitle => 'Verbindingsstatistieken';

  @override
  String get pingSentToServer => '🏓 Ping naar server verzonden';

  @override
  String get requestingConnectionStatistics => '📊 Verbindingsstatistieken opvragen...';

  @override
  String get startingStabilityTest => '🧪 30-seconden stabiliteitstest starten...';

  @override
  String get stabilityTestCompleted => '✅ Stabiliteitstest voltooid';

  @override
  String get connectionLostDuringStabilityTest => '❌ Verbinding verbroken tijdens stabiliteitstest';

  @override
  String currentLanguage(String language) {
    return 'Huidige taal: $language';
  }

  @override
  String get statsActive => 'Actief:';

  @override
  String get statsTotal => 'Totaal:';

  @override
  String get statsMax => 'Max:';

  @override
  String get refund => 'Terugbetaling';

  @override
  String get optionalRefundAmountHint => 'Optioneel: specificeer terugbetalingsbedrag (standaard volledig)';

  @override
  String get refundSuccessful => 'Terugbetaling succesvol';

  @override
  String get refundFailed => 'Terugbetaling mislukt';
}
