import 'package:flutter/material.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';

class TestCardInfoWidget extends StatelessWidget {
  const TestCardInfoWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              l10n.testCardNumbers,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Text(l10n.useTestCardNumbers),
            const SizedBox(height: 8),
            Text(l10n.visaTestCard),
            Text(l10n.mastercardTestCard),
            Text(l10n.declinedTestCard),
            Text(l10n.testCardInstructions),
          ],
        ),
      ),
    );
  }
}
