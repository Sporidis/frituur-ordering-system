export function renderElementsPage(
  publishableKey: string,
  clientSecret: string,
): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="https://js.stripe.com/v3/"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Arial, sans-serif; padding: 16px; }
    #payment-element { padding: 12px; border: 1px solid #e0e0e0; border-radius: 8px; }
    #pay-btn { margin-top: 12px; padding: 10px 16px; background: #ff9800; color: white; border: 0; border-radius: 6px; cursor: pointer; }
    #status { margin-top: 12px; }
  </style>
  <title>Stripe Elements</title>
</head>
<body>
  <h3>Enter card details</h3>
  <div id="payment-element"></div>
  <button id="pay-btn">Pay</button>
  <div id="status"></div>
  <script>
    (async function(){
      try {
        const stripe = Stripe(${JSON.stringify(publishableKey)});
        const elements = stripe.elements({ clientSecret: ${JSON.stringify(clientSecret)}, appearance: { theme: 'stripe' } });
        const paymentElement = elements.create('payment', { layout: 'tabs' });
        paymentElement.mount('#payment-element');

        const statusEl = document.getElementById('status');
        const setStatus = (msg, ok) => { statusEl.textContent = msg; statusEl.style.color = ok ? 'green' : 'red'; };

        document.getElementById('pay-btn').addEventListener('click', async () => {
          setStatus('Processing...', true);
          try {
            const submitResult = await elements.submit();
            if (submitResult && submitResult.error) {
              setStatus(submitResult.error.message || 'Validation failed', false);
              if (window.flutter_inappwebview) {
                window.flutter_inappwebview.callHandler('paymentResult', { success: false, error: submitResult.error.message || 'Validation failed' });
              }
              return;
            }

            const returnUrl = window.location.origin + '/payments/return?publishable_key=' + encodeURIComponent(${JSON.stringify(publishableKey)});
            const result = await stripe.confirmPayment({
              elements,
              clientSecret: ${JSON.stringify(clientSecret)},
              redirect: 'if_required',
              confirmParams: { return_url: returnUrl }
            });
            if (result.error) {
              setStatus(result.error.message || 'Payment failed', false);
              if (window.flutter_inappwebview) {
                window.flutter_inappwebview.callHandler('paymentResult', { success: false, error: result.error.message || 'Payment failed' });
              }
            } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
              setStatus('Payment succeeded', true);
              try { await fetch('/payments/sync-status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentIntentId: result.paymentIntent.id }) }); } catch (e) {}
              if (window.flutter_inappwebview) {
                window.flutter_inappwebview.callHandler('paymentResult', { success: true, status: 'succeeded' });
              }
            } else {
              const status = result.paymentIntent && result.paymentIntent.status;
              setStatus('Payment status: ' + status, false);
              try { if (result.paymentIntent && result.paymentIntent.id) { await fetch('/payments/sync-status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentIntentId: result.paymentIntent.id }) }); } } catch (e) {}
              if (window.flutter_inappwebview) {
                window.flutter_inappwebview.callHandler('paymentResult', { success: false, status });
              }
            }
          } catch (e) {
            setStatus('Error: ' + e, false);
            if (window.flutter_inappwebview) {
              window.flutter_inappwebview.callHandler('paymentResult', { success: false, error: String(e) });
            }
          }
        });
      } catch (e) {
        if (window.flutter_inappwebview) {
          window.flutter_inappwebview.callHandler('paymentResult', { success: false, error: 'Init error: ' + e });
        }
      }
    })();
  </script>
</body>
</html>`;
}

export function renderReturnPage(publishableKey: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="https://js.stripe.com/v3/"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Arial, sans-serif; padding: 24px; text-align:center; }
    .ok { color: #2e7d32; }
    .err { color: #c62828; }
  </style>
  <title>Completing Payment…</title>
</head>
<body>
  <h3>Completing payment…</h3>
  <div id="status">Checking status…</div>
  <script>
    (async function(){
      try {
        const params = new URLSearchParams(window.location.search);
        const clientSecret = params.get('payment_intent_client_secret');
        const stripe = Stripe(${JSON.stringify(publishableKey)});
        if (!clientSecret) {
          document.getElementById('status').textContent = 'Missing client secret on return URL.';
          if (window.flutter_inappwebview) {
            window.flutter_inappwebview.callHandler('paymentResult', { success: false, error: 'Missing client secret on return URL.' });
          }
          return;
        }
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        const status = paymentIntent && paymentIntent.status;
        try { if (paymentIntent && paymentIntent.id) { await fetch('/payments/sync-status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentIntentId: paymentIntent.id }) }); } } catch (e) {}
        if (status === 'succeeded') {
          document.getElementById('status').textContent = 'Payment succeeded.';
          document.getElementById('status').className = 'ok';
          if (window.flutter_inappwebview) {
            window.flutter_inappwebview.callHandler('paymentResult', { success: true, status });
          }
        } else {
          document.getElementById('status').textContent = 'Payment status: ' + status;
          document.getElementById('status').className = 'err';
          if (window.flutter_inappwebview) {
            window.flutter_inappwebview.callHandler('paymentResult', { success: false, status });
          }
        }
      } catch (e) {
        document.getElementById('status').textContent = 'Error: ' + e;
        document.getElementById('status').className = 'err';
        if (window.flutter_inappwebview) {
          window.flutter_inappwebview.callHandler('paymentResult', { success: false, error: String(e) });
        }
      }
    })();
  </script>
</body>
</html>`;
}
