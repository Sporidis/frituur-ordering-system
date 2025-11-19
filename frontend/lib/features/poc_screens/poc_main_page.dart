import 'package:flutter/material.dart';
import 'package:frituur_ordering_system/shared/mod.dart';
import 'widgets/mod.dart';

/// Main page for PoC demonstrations
class PocMainPage extends StatelessWidget {
  const PocMainPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const PocAppBar(),
      body: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: Responsive.maxContentWidth),
          child: Padding(
            padding: const EdgeInsets.all(AppConstants.defaultPadding),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [PocHeaderSection(), PocCardsGrid()],
            ),
          ),
        ),
      ),
    );
  }
}
