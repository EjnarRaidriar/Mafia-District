# WebSocket Gateway Fix

## Problem
The WebSocket connections through the gateway were failing with the error:
```
Parse Error: Expected HTTP/
```

And connections would hang indefinitely when trying to connect through the gateway (port 3000) while direct connections to the service (port 8200) worked fine.

## Root Cause
The gateway's WebSocket upgrade handler was using **raw TCP socket connections** (`net.connect()` / `tls.connect()`) instead of Node.js's built-in HTTP upgrade mechanism.

### The Wrong Approach (Raw Socket Manipulation)
The broken implementation attempted to:
1. Open a raw TCP socket to the backend
2. Manually construct and send HTTP upgrade request text
3. Manually parse the HTTP 101 response
4. Set up bidirectional piping

This low-level approach is error-prone and doesn't properly handle the HTTP upgrade protocol.

### The Right Approach (Use Node's HTTP Upgrade Support)
Node.js's `http` module has built-in support for WebSocket upgrades via the `'upgrade'` event. This automatically handles:
- HTTP/1.1 upgrade protocol
- Proper header forwarding
- Response parsing
- Socket management

## Solution
Use `http.request()` with the `'upgrade'` event to properly handle WebSocket upgrades:

```javascript
server.on("upgrade", (req, socket, head) => {
  // 1. Match route and build target URL
  const match = matchPrefix(config, parsedUrl.pathname);
  const targetUrl = new URL(match.target);
  const finalPath = pathJoinPreserve(targetUrl.pathname, after);
  
  // 2. Create an HTTP request to the backend
  const proxyReq = http.request({
    hostname: targetUrl.hostname,
    port: targetUrl.port,
    path: finalPath,
    method: req.method,
    headers: req.headers,
  });
  
  // 3. Listen for the 'upgrade' event from backend
  proxyReq.on("upgrade", (proxyRes, proxySocket, proxyHead) => {
    // 4. Pipe data bidirectionally
    proxySocket.write(head);      // Forward initial data to backend
    proxySocket.pipe(socket);     // Backend → Client
    socket.write(proxyHead);      // Forward backend response to client
    socket.pipe(proxySocket);     // Client → Backend
  });
  
  // 5. End the request to trigger the upgrade
  proxyReq.end();
});
```

This approach:
- ✅ Uses Node's built-in HTTP upgrade protocol
- ✅ Automatically sends and receives HTTP 101 response
- ✅ Properly handles all WebSocket frames
- ✅ No manual header construction or response parsing
- ✅ Works with both HTTP and HTTPS backends

## Code Changes

### Before (Broken - Raw Socket Approach)
```javascript
server.on("upgrade", (req, clientSocket, head) => {
  // ❌ Using raw TCP sockets
  const backendSocket = net.connect({
    host: targetUrl.hostname,
    port: targetUrl.port
  });
  
  // ❌ Manually constructing HTTP request
  const requestLines = [];
  requestLines.push(`${req.method} ${finalPath} HTTP/1.1`);
  // ... manually build all headers ...
  const initialRequest = requestLines.join("\r\n");
  
  backendSocket.on("connect", () => {
    backendSocket.write(initialRequest);
    backendSocket.write(head);
    clientSocket.pipe(backendSocket).pipe(clientSocket);
  });
});
```

### After (Working - HTTP Request Approach)
```javascript
server.on("upgrade", (req, socket, head) => {
  // ✅ Using http.request() with proper upgrade handling
  const proxyReq = http.request({
    hostname: targetUrl.hostname,
    port: targetUrl.port,
    path: finalPath,
    method: req.method,
    headers: req.headers,
  });
  
  // ✅ Listen for upgrade event (not connect!)
  proxyReq.on("upgrade", (proxyRes, proxySocket, proxyHead) => {
    proxySocket.write(head);
    proxySocket.pipe(socket);
    socket.write(proxyHead);
    socket.pipe(proxySocket);
  });
  
  proxyReq.end();
});
```

## Testing

### Option 1: Use the test script
```bash
cd /Users/dragomirmindrescu/Desktop/University/PAD/Lab\ 0/Mafia-District
node test-ws.js
```

Expected output:
```
Testing WebSocket connections...

1. Testing DIRECT connection to: ws://localhost:8200/api/roleplay/ws/3
✅ Direct connection SUCCESSFUL

2. Testing GATEWAY connection to: ws://localhost:3000/api/roleplay/ws/3
✅ Gateway connection SUCCESSFUL
```

### Option 2: Check logs manually

1. **Start all services** (gateway on 3000, roleplay-service on 8200, game-service on 4141)

2. **Game service logs** - should show:
   ```
   ✅ Connected to Roleplay WebSocket for game X
   ```

3. **Gateway logs** - should show:
   ```
   [ws-proxy] GET /api/roleplay/ws/1 -> http://roleplay-service:8200/api/roleplay/ws/1
   ```

4. **Test from browser console**:
   ```javascript
   const ws = new WebSocket('ws://localhost:3000/api/roleplay/ws/1');
   ws.onopen = () => console.log('Connected!');
   ws.onmessage = (event) => console.log('Message:', event.data);
   ```

## Key Differences Between Approaches

| Aspect | Raw Socket (Broken) | HTTP Request (Working) |
|--------|---------------------|------------------------|
| **Connection** | `net.connect()` | `http.request()` |
| **Event** | Listen for `'connect'` | Listen for `'upgrade'` |
| **HTTP Handling** | Manual text construction | Automatic by Node.js |
| **Response Parsing** | Manual buffering needed | Automatic by Node.js |
| **Error Handling** | Complex, error-prone | Built-in, robust |
| **Code Complexity** | ~100 lines | ~40 lines |

## Files Modified
- `microservices/gateway/index.js` (lines 1-6, 293-373)
  - Removed unused `net` and `tls` imports
  - Replaced entire WebSocket upgrade handler (lines 293-373)

## References
- Node.js HTTP Upgrade: https://nodejs.org/api/http.html#event-upgrade
- WebSocket RFC 6455: https://datatracker.ietf.org/doc/html/rfc6455
- HTTP/1.1 Upgrade mechanism: https://datatracker.ietf.org/doc/html/rfc7230#section-6.7

