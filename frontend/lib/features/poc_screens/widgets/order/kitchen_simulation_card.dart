import 'package:flutter/material.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';

class KitchenSimulationCard extends StatelessWidget {
  final VoidCallback onSimulateKitchen;

  const KitchenSimulationCard({super.key, required this.onSimulateKitchen});

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
              l10n.kitchenSimulation,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: onSimulateKitchen,
                icon: const Icon(Icons.restaurant),
                label: Text(l10n.simulateKitchenWorkflow),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.purple,
                  foregroundColor: Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
