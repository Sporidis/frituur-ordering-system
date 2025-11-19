import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';
import 'package:frituur_ordering_system/core/mod.dart';

class PaymentAppBar extends StatelessWidget implements PreferredSizeWidget {
  const PaymentAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final languageProvider = Provider.of<LanguageProvider>(context);

    return AppBar(
      title: Text('${l10n.appTitle} - ${l10n.paymentPoc}'),
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
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
