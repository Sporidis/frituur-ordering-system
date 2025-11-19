import 'dart:async';
import 'package:flutter/material.dart';
import 'package:frituur_ordering_system/shared/mod.dart';
import 'package:frituur_ordering_system/l10n/app_localizations.dart';
import 'package:frituur_ordering_system/features/websocket/presentation/websocket_view_model.dart';

class WebSocketControlsCard extends StatefulWidget {
  final WebSocketViewModel webSocketViewModel;

  const WebSocketControlsCard({super.key, required this.webSocketViewModel});

  @override
  State<WebSocketControlsCard> createState() => _WebSocketControlsCardState();
}

class _WebSocketControlsCardState extends State<WebSocketControlsCard> {
  Timer? _stabilityTestTimer;
  bool _isStabilityTestRunning = false;

  @override
  void dispose() {
    _stabilityTestTimer?.cancel();
    super.dispose();
  }

  void _pingServer() {
    widget.webSocketViewModel.pingServer();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(AppLocalizations.of(context)!.pingSentToServer),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _requestConnectionStats() {
    widget.webSocketViewModel.requestConnectionStats();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          AppLocalizations.of(context)!.requestingConnectionStatistics,
        ),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _startStabilityTest() {
    if (_isStabilityTestRunning) return;

    setState(() {
      _isStabilityTestRunning = true;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(AppLocalizations.of(context)!.startingStabilityTest),
        duration: const Duration(seconds: 2),
      ),
    );

    // Ping every 5 seconds for 30 seconds
    int pingCount = 0;
    _stabilityTestTimer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (pingCount >= 6) {
        // 6 pings over 30 seconds
        timer.cancel();
        setState(() {
          _isStabilityTestRunning = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(AppLocalizations.of(context)!.stabilityTestCompleted),
            backgroundColor: Colors.green,
            duration: const Duration(seconds: 3),
          ),
        );
        return;
      }

      if (widget.webSocketViewModel.isConnected) {
        widget.webSocketViewModel.pingServer();
        pingCount++;
      } else {
        timer.cancel();
        setState(() {
          _isStabilityTestRunning = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              AppLocalizations.of(context)!.connectionLostDuringStabilityTest,
            ),
            backgroundColor: Colors.red,
            duration: const Duration(seconds: 3),
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return ResponsiveCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ResponsiveText(
            l10n.websocketControls,
            fontWeight: FontWeight.bold,
            isTitle: true,
          ),
          SizedBox(height: Responsive.getResponsiveSpacing(context)),

          // Connection Controls
          ResponsiveRow(
            children: [
              ResponsiveButton(
                onPressed: widget.webSocketViewModel.isConnected
                    ? null
                    : () => widget.webSocketViewModel.connect(),
                icon: Icons.link,
                label: l10n.connect,
                backgroundColor: Colors.green,
                foregroundColor: Colors.white,
                isFullWidth: true,
              ),
              ResponsiveButton(
                onPressed: widget.webSocketViewModel.isConnected
                    ? () => widget.webSocketViewModel.disconnect()
                    : null,
                icon: Icons.link_off,
                label: l10n.disconnect,
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
                isFullWidth: true,
              ),
            ],
          ),

          SizedBox(height: Responsive.getResponsiveSpacing(context)),

          // PoC Testing Controls
          ResponsiveText(
            l10n.pocTesting,
            fontWeight: FontWeight.bold,
            isSubtitle: true,
          ),
          SizedBox(height: Responsive.getResponsiveSpacing(context) * 0.5),

          ResponsiveRow(
            children: [
              ResponsiveButton(
                onPressed: widget.webSocketViewModel.isConnected
                    ? _pingServer
                    : null,
                icon: Icons.sports_tennis,
                label: l10n.ping,
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
                isFullWidth: true,
              ),
              ResponsiveButton(
                onPressed: widget.webSocketViewModel.isConnected
                    ? _requestConnectionStats
                    : null,
                icon: Icons.analytics,
                label: l10n.stats,
                backgroundColor: Colors.purple,
                foregroundColor: Colors.white,
                isFullWidth: true,
              ),
            ],
          ),

          SizedBox(height: Responsive.getResponsiveSpacing(context) * 0.5),

          ResponsiveRow(
            children: [
              ResponsiveButton(
                onPressed:
                    (widget.webSocketViewModel.isConnected &&
                        !_isStabilityTestRunning)
                    ? _startStabilityTest
                    : null,
                icon: Icons.timer,
                label: _isStabilityTestRunning
                    ? l10n.testingEllipsis
                    : l10n.stabilityTest,
                backgroundColor: Colors.orange,
                foregroundColor: Colors.white,
                isLoading: _isStabilityTestRunning,
                isFullWidth: true,
              ),
            ],
          ),

          // Display last pong and connection stats
          if (widget.webSocketViewModel.lastPong != null) ...[
            SizedBox(height: Responsive.getResponsiveSpacing(context)),
            ResponsiveInfoCard(
              title: l10n.lastPong,
              content: widget.webSocketViewModel.lastPong!.timestamp
                  .toIso8601String(),
              color: Colors.green,
              icon: Icons.sports_tennis,
            ),
          ],

          if (widget.webSocketViewModel.lastConnectionStats != null) ...[
            SizedBox(height: Responsive.getResponsiveSpacing(context) * 0.5),
            ResponsiveInfoCard(
              title: l10n.connectionStatsTitle,
              content:
                  '${l10n.statsActive} ${widget.webSocketViewModel.lastConnectionStats!.activeConnections}\n'
                  '${l10n.statsTotal} ${widget.webSocketViewModel.lastConnectionStats!.totalConnections}\n'
                  '${l10n.statsMax} ${widget.webSocketViewModel.lastConnectionStats!.maxConcurrentConnections}',
              color: Colors.blue,
              icon: Icons.analytics,
            ),
          ],
        ],
      ),
    );
  }
}
