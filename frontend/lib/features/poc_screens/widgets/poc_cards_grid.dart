import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';
import 'package:frituur_ordering_system/shared/mod.dart';
import 'package:frituur_ordering_system/features/auth/mod.dart';
import '../poc_websocket_page.dart';
import '../poc_payment_page.dart';
import 'poc_card_widget.dart';

/// Grid of PoC cards
class PocCardsGrid extends StatelessWidget {
  const PocCardsGrid({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final authProvider = Provider.of<AuthProvider>(context);

    return Expanded(
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
                MaterialPageRoute(builder: (context) => const PocPaymentPage()),
              );
            },
          ),

          // PoC 4: Admin Auth
          PocCardWidget(
            title: authProvider.isAuthenticated
                ? l10n.adminPanel
                : l10n.adminLogin,
            description: authProvider.isAuthenticated
                ? l10n.loggedInAs(authProvider.role ?? 'admin')
                : l10n.testAuthentication,
            icon: Icons.admin_panel_settings,
            color: Colors.orange,
            isComingSoon: false,
            onTap: () {
              if (authProvider.isAuthenticated) {
                authProvider.logout();
                ScaffoldMessenger.of(
                  context,
                ).showSnackBar(SnackBar(content: Text(l10n.loggedOut)));
              } else {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginPage()),
                );
              }
            },
          ),
        ],
      ),
    );
  }
}
