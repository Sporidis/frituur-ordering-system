import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';
import 'package:provider/provider.dart';

import 'core/mod.dart';
import 'features/auth/mod.dart';
import 'features/poc_screens/mod.dart';

class FrituurOrderingApp extends StatelessWidget {
  const FrituurOrderingApp({super.key});

  @override
  Widget build(BuildContext context) {
    final languageProvider = LanguageProvider();
    final authProvider = getIt<AuthProvider>();
    authProvider.initialize();

    return MultiProvider(
      providers: [
        ChangeNotifierProvider<LanguageProvider>.value(value: languageProvider),
        ChangeNotifierProvider<AuthProvider>.value(value: authProvider),
      ],
      child: Consumer<LanguageProvider>(
        builder: (context, languageProvider, child) {
          return MaterialApp(
            title: 'Frituur Ordering System - PoC',
            debugShowCheckedModeBanner: false,
            localizationsDelegates: _localizationsDelegates,
            supportedLocales: _supportedLocales,
            locale: languageProvider.currentLocale,
            theme: AppTheme.lightTheme,
            home: const PocMainPage(),
          );
        },
      ),
    );
  }

  static const _localizationsDelegates = [
    AppLocalizations.delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
  ];

  static const _supportedLocales = [
    Locale('en', ''), // English
    Locale('nl', ''), // Dutch
  ];
}
