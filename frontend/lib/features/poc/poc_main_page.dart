import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';

import 'package:frituur_ordering_system/shared/mod.dart';
import 'widgets/mod.dart';
import 'poc_websocket_page.dart';
import 'poc_payment_page.dart';

class PocMainPage extends StatelessWidget {
  const PocMainPage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final languageProvider = Provider.of<LanguageProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('${l10n.appTitle} - ${l10n.pocs}'),
        backgroundColor: Colors.orange,
        foregroundColor: Colors.white,
        actions: [
          // Language toggle
          PopupMenuButton<String>(
            icon: const Icon(Icons.language),
            onSelected: (String languageCode) {
              if (languageCode == 'en') {
                languageProvider.setLocale(const Locale('en', ''));
              } else {
                languageProvider.setLocale(const Locale('nl', ''));
              }
            },
            itemBuilder: (BuildContext context) => [
              PopupMenuItem<String>(
                value: 'en',
                child: Row(
                  children: [
                    const Icon(Icons.flag, color: Colors.blue),
                    const SizedBox(width: 8),
                    Text(l10n.english),
                  ],
                ),
              ),
              PopupMenuItem<String>(
                value: 'nl',
                child: Row(
                  children: [
                    const Icon(Icons.flag, color: Colors.red),
                    const SizedBox(width: 8),
                    Text(l10n.dutch),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: Responsive.maxContentWidth),
          child: Padding(
            padding: const EdgeInsets.all(AppConstants.defaultPadding),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  l10n.pocs,
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: Colors.orange,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  l10n.selectPocToTest,
                  style: Theme.of(
                    context,
                  ).textTheme.bodyLarge?.copyWith(color: Colors.grey[600]),
                ),
                const SizedBox(height: AppConstants.cardSpacing),

                // PoC Cards
                Expanded(
                  child: GridView.count(
                    crossAxisCount: 2,
                    crossAxisSpacing: AppConstants.defaultPadding,
                    mainAxisSpacing: AppConstants.defaultPadding,
                    children: [
                      // PoC 1: i18n
                      PocCardWidget(
                        title: l10n.poc1I18n,
                        description: l10n.poc1I18nDescription,
                        icon: Icons.language,
                        color: Colors.blue,
                        onTap: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(l10n.i18nIntegratedInAllPocs),
                              backgroundColor: Colors.blue,
                            ),
                          );
                        },
                      ),

                      // PoC 2: WebSocket
                      PocCardWidget(
                        title: l10n.poc2Websocket,
                        description: l10n.poc2WebsocketDescription,
                        icon: Icons.wifi,
                        color: Colors.green,
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const PocWebSocketPage(),
                            ),
                          );
                        },
                      ),

                      // PoC 3: Stripe Payment
                      PocCardWidget(
                        title: l10n.poc3Stripe,
                        description: l10n.poc3StripeDescription,
                        icon: Icons.payment,
                        color: Colors.purple,
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const PocPaymentPage(),
                            ),
                          );
                        },
                      ),

                      // PoC 4: Modular Monolith (Coming Soon)
                      PocCardWidget(
                        title: l10n.poc4Modular,
                        description: l10n.poc4ModularDescription,
                        icon: Icons.architecture,
                        color: Colors.orange,
                        isComingSoon: true,
                        onTap: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(l10n.comingSoonModularPoc),
                              backgroundColor: Colors.orange,
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
