import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';
import 'package:provider/provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'shared/providers/language_provider.dart';
import 'shared/services/websocket_service.dart';
import 'features/poc/mod.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Load environment variables from .env file
  await dotenv.load(fileName: "assets/.env");

  runApp(const FrituurOrderingApp());
}

class FrituurOrderingApp extends StatelessWidget {
  const FrituurOrderingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => LanguageProvider()),
        ChangeNotifierProvider(create: (_) => WebSocketService()),
      ],
      child: Consumer<LanguageProvider>(
        builder: (context, languageProvider, child) {
          return MaterialApp(
            title: 'Frituur Ordering System - PoC',
            debugShowCheckedModeBanner: false,

            // Localization configuration
            localizationsDelegates: const [
              AppLocalizations.delegate,
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
            supportedLocales: const [
              Locale('en', ''), // English
              Locale('nl', ''), // Dutch
            ],
            locale: languageProvider.currentLocale,

            // Theme configuration
            theme: ThemeData(
              primarySwatch: Colors.orange,
              useMaterial3: true,
              appBarTheme: const AppBarTheme(
                backgroundColor: Colors.orange,
                foregroundColor: Colors.white,
                elevation: 2,
              ),
            ),

            // App routes
            home: const PocMainPage(),
          );
        },
      ),
    );
  }
}
