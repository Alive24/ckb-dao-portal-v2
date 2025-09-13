import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Simple test page to verify WebAuthn is working
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>WebAuthn Test</title>
  <style>
    body { font-family: system-ui; padding: 20px; max-width: 600px; margin: 0 auto; }
    button { padding: 10px 20px; margin: 10px 0; font-size: 16px; cursor: pointer; }
    .success { color: green; }
    .error { color: red; }
    pre { background: #f4f4f4; padding: 10px; overflow: auto; }
  </style>
</head>
<body>
  <h1>WebAuthn Registration Test</h1>
  <button onclick="testRegistration()">Test Registration Options</button>
  <div id="output"></div>

  <script>
    async function testRegistration() {
      const output = document.getElementById('output');
      output.innerHTML = '<p>Testing registration options...</p>';
      
      try {
        const response = await fetch('/api/binding/registration-options', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 'test_' + Date.now(),
            userName: 'testuser',
            userDisplayName: 'Test User'
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          output.innerHTML = '<p class="success">✅ Registration options received successfully!</p>' +
                           '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        } else {
          output.innerHTML = '<p class="error">❌ Failed: ' + (data.error || 'Unknown error') + '</p>';
        }
      } catch (error) {
        output.innerHTML = '<p class="error">❌ Error: ' + error.message + '</p>';
      }
    }
  </script>
</body>
</html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
