import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

class PaymentElementsWebViewPage extends StatefulWidget {
  final String clientSecret;
  final String publishableKey;

  const PaymentElementsWebViewPage({
    super.key,
    required this.clientSecret,
    required this.publishableKey,
  });

  @override
  State<PaymentElementsWebViewPage> createState() =>
      _PaymentElementsWebViewPageState();
}

class _PaymentElementsWebViewPageState
    extends State<PaymentElementsWebViewPage> {
  bool _isLoading = true;

  Uri _buildElementsUrl() {
    return Uri.parse('http://localhost:3000/payments/elements').replace(
      queryParameters: <String, String>{
        'client_secret': widget.clientSecret,
        'publishable_key': widget.publishableKey,
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Card Entry'),
        backgroundColor: Colors.orange,
        foregroundColor: Colors.white,
      ),
      body: Stack(
        children: [
          InAppWebView(
            initialUrlRequest: URLRequest(url: WebUri.uri(_buildElementsUrl())),
            initialSettings: InAppWebViewSettings(
              javaScriptEnabled: true,
              javaScriptCanOpenWindowsAutomatically: true,
              supportMultipleWindows: true,
            ),
            onWebViewCreated: (controller) async {
              controller.addJavaScriptHandler(
                handlerName: 'paymentResult',
                callback: (args) async {
                  // args[0] will be the payload we sent from JS
                  if (!mounted) return;
                  if (args.isNotEmpty && args[0] is Map) {
                    final map = Map<String, dynamic>.from(args[0] as Map);
                    Navigator.of(context).pop(map);
                  } else {
                    Navigator.of(
                      context,
                    ).pop({'success': false, 'error': 'Unknown result'});
                  }
                },
              );
            },
            onLoadStop: (controller, url) {
              setState(() {
                _isLoading = false;
              });
            },
            onCreateWindow: (controller, action) async {
              final targetUrl = action.request.url;
              if (targetUrl != null) {
                await controller.loadUrl(
                  urlRequest: URLRequest(url: targetUrl),
                );
              }
              return null;
            },
          ),
          if (_isLoading) const Center(child: CircularProgressIndicator()),
        ],
      ),
    );
  }
}
