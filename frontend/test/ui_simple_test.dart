import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';
import 'package:frituur_ordering_system/shared/providers/language_provider.dart';

void main() {
  group('UI Language Switch Performance Tests', () {
    testWidgets('UI language switch performance measurement', (
      WidgetTester tester,
    ) async {
      // Create a test app with language provider
      await tester.pumpWidget(
        MultiProvider(
          providers: [
            ChangeNotifierProvider(create: (_) => LanguageProvider()),
          ],
          child: MaterialApp(
            localizationsDelegates: const [
              AppLocalizations.delegate,
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
            supportedLocales: const [Locale('en', ''), Locale('nl', '')],
            home: const SimpleTestPage(),
          ),
        ),
      );

      // Wait for initial build
      await tester.pumpAndSettle();

      // Find the language provider
      final languageProvider = tester
          .element(find.byType(SimpleTestPage))
          .read<LanguageProvider>();

      // Measure UI language switch time
      final stopwatch = Stopwatch()..start();

      // Switch to Dutch
      languageProvider.setLocale(const Locale('nl', ''));
      await tester.pumpAndSettle();

      stopwatch.stop();
      final switchTime = stopwatch.elapsedMilliseconds;

      debugPrint('UI language switch time: ${switchTime}ms');

      // Verify the language provider state changed
      expect(languageProvider.currentLocale.languageCode, equals('nl'));

      // Performance assertion
      expect(
        switchTime,
        lessThan(100),
        reason: 'UI language switch should be under 100ms, was ${switchTime}ms',
      );
    });

    testWidgets('UI language toggle performance measurement', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        MultiProvider(
          providers: [
            ChangeNotifierProvider(create: (_) => LanguageProvider()),
          ],
          child: MaterialApp(
            localizationsDelegates: const [
              AppLocalizations.delegate,
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
            supportedLocales: const [Locale('en', ''), Locale('nl', '')],
            home: const SimpleTestPage(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      final languageProvider = tester
          .element(find.byType(SimpleTestPage))
          .read<LanguageProvider>();

      // Measure UI language toggle time
      final stopwatch = Stopwatch()..start();

      // Toggle language
      languageProvider.toggleLanguage();
      await tester.pumpAndSettle();

      stopwatch.stop();
      final toggleTime = stopwatch.elapsedMilliseconds;

      debugPrint('UI language toggle time: ${toggleTime}ms');

      // Verify the language provider state changed
      expect(languageProvider.currentLocale.languageCode, equals('nl'));

      // Performance assertion
      expect(
        toggleTime,
        lessThan(100),
        reason: 'UI language toggle should be under 100ms, was ${toggleTime}ms',
      );
    });

    testWidgets('UI rebuild performance with multiple switches', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        MultiProvider(
          providers: [
            ChangeNotifierProvider(create: (_) => LanguageProvider()),
          ],
          child: MaterialApp(
            localizationsDelegates: const [
              AppLocalizations.delegate,
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
            supportedLocales: const [Locale('en', ''), Locale('nl', '')],
            home: const SimpleTestPage(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      final languageProvider = tester
          .element(find.byType(SimpleTestPage))
          .read<LanguageProvider>();

      // Measure multiple UI rebuilds
      final stopwatch = Stopwatch()..start();

      // Switch multiple times
      languageProvider.setLocale(const Locale('nl', ''));
      await tester.pumpAndSettle();

      languageProvider.setLocale(const Locale('en', ''));
      await tester.pumpAndSettle();

      languageProvider.setLocale(const Locale('nl', ''));
      await tester.pumpAndSettle();

      stopwatch.stop();
      final totalTime = stopwatch.elapsedMilliseconds;
      final avgTime = totalTime / 3;

      debugPrint('Total time for 3 UI switches: ${totalTime}ms');
      debugPrint('Average time per UI switch: ${avgTime}ms');

      // Performance assertion
      expect(
        avgTime,
        lessThan(50),
        reason:
            'Average UI language switch should be under 50ms, was ${avgTime}ms',
      );
    });
  });
}

// Simple test page that focuses on performance measurement
class SimpleTestPage extends StatelessWidget {
  const SimpleTestPage({super.key});

  @override
  Widget build(BuildContext context) {
    final languageProvider = Provider.of<LanguageProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Language: ${languageProvider.currentLocale.languageCode}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.language),
            onPressed: () {
              languageProvider.toggleLanguage();
            },
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Current Language: ${languageProvider.currentLocale.languageCode}',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                languageProvider.setLocale(const Locale('en', ''));
              },
              child: const Text('Switch to English'),
            ),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: () {
                languageProvider.setLocale(const Locale('nl', ''));
              },
              child: const Text('Switch to Dutch'),
            ),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: () {
                languageProvider.toggleLanguage();
              },
              child: const Text('Toggle Language'),
            ),
          ],
        ),
      ),
    );
  }
}
