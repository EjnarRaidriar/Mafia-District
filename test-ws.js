const WebSocket = require('ws');

// Test WebSocket connection through gateway
const gatewayWsUrl = 'ws://localhost:3000/api/roleplay/ws/3';
const directWsUrl = 'ws://localhost:8200/api/roleplay/ws/3';

console.log('Testing WebSocket connections...\n');

// Test direct connection first
console.log(`1. Testing DIRECT connection to: ${directWsUrl}`);
const directWs = new WebSocket(directWsUrl);

directWs.on('open', () => {
  console.log('✅ Direct connection SUCCESSFUL');
  directWs.close();
  
  // Now test through gateway
  console.log(`\n2. Testing GATEWAY connection to: ${gatewayWsUrl}`);
  const gatewayWs = new WebSocket(gatewayWsUrl);
  
  const timeout = setTimeout(() => {
    console.log('❌ Gateway connection TIMEOUT (10 seconds)');
    gatewayWs.terminate();
    process.exit(1);
  }, 10000);
  
  gatewayWs.on('open', () => {
    clearTimeout(timeout);
    console.log('✅ Gateway connection SUCCESSFUL');
    gatewayWs.close();
    process.exit(0);
  });
  
  gatewayWs.on('error', (err) => {
    clearTimeout(timeout);
    console.log('❌ Gateway connection ERROR:', err.message);
    process.exit(1);
  });
});

directWs.on('error', (err) => {
  console.log('❌ Direct connection ERROR:', err.message);
  console.log('Skipping gateway test since direct connection failed');
  process.exit(1);
});


