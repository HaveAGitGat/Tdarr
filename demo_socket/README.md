# Tdarr Socket.io Debug Demo

This is a minimal reproduction setup to debug socket.io connection issues between Tdarr's frontend and backend.

## What This Demo Does

This demo mimics the exact socket.io setup that Tdarr uses:

- **Backend**: Fastify server with socket.io attached (same as `be/srcts/api/servers.ts`)
- **Frontend**: HTML page that connects using socket.io-client to the `/webui` namespace
- **Configuration**: Uses the same socket.io timeout settings as Tdarr
- **Version**: socket.io v4.7.5 (matching Tdarr's version)

## Setup

1. Install dependencies:
   ```bash
   cd bug_info
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   # or
   node server.js
   ```

3. Open your browser to:
   ```
   http://localhost:8266
   ```

## What to Look For

The demo page will show:

- **Connection Status**: Whether the socket is connected, disconnected, or connecting
- **Socket ID**: The unique ID assigned to your socket connection
- **Transport**: The transport type (polling → websocket after upgrade)
- **Event Log**: Real-time log of all socket events

### Key Events to Monitor

1. **Initial Connection**: Should start with `polling` transport
2. **Transport Upgrade**: Should automatically upgrade to `websocket`
3. **Sync Events**: Server sends `syncServerTime` events every second
4. **Connection Errors**: Any 400 errors or connection failures

## Testing Scenarios

### Test 1: Basic Connection
- Open the page and verify it connects successfully
- Check that transport upgrades from polling to websocket

### Test 2: Reconnection
- Click "Disconnect" button
- Click "Reconnect" button
- Verify it reconnects successfully

### Test 3: Behind Proxy
- If testing behind a reverse proxy (like Traefik/nginx), monitor for:
  - WebSocket upgrade failures (400 errors)
  - Connection timeouts
  - Authentication header issues

### Test 4: With Authentication
- Edit `index.html` and uncomment the `extraHeaders` section (line 252-254)
- This mimics how Tdarr sends auth tokens via socket headers

## Comparing to Actual Tdarr

### Backend Differences
- **Simplified**: No database, no API endpoints, no authentication
- **Same**: Fastify setup, socket.io configuration, namespace structure

### Frontend Differences
- **Simplified**: Plain HTML/JS instead of React
- **Same**: socket.io-client setup, namespace, path configuration, event handling

## Related Issues

This demo helps debug:
- Issue #1189: Websocket always returns 400
- Issue #1179: Status tables undefined (possibly socket-related)

## Debugging Tips

1. **Open Browser DevTools**:
   - Network tab → Filter by "WS" to see WebSocket connections
   - Console tab → See detailed connection logs

2. **Check Server Logs**:
   - Server logs show when clients connect/disconnect
   - Shows transport type and any errors

3. **Test Different Browsers**:
   - Chrome/Edge (Chromium)
   - Firefox
   - Safari

4. **Test Different Networks**:
   - localhost (127.0.0.1)
   - LAN IP (192.168.x.x)
   - Behind reverse proxy

## Server Configuration

The demo server matches Tdarr's socket.io configuration:

```javascript
{
  pingTimeout: 60000,    // 60 seconds
  pingInterval: 25000,   // 25 seconds
  connectTimeout: 60000, // 60 seconds
  upgradeTimeout: 30000  // 30 seconds
}
```

## Expected Behavior

✅ **Good**:
- Connection status shows "Connected"
- Transport shows "websocket" (after upgrade)
- Log shows successful connection and sync events
- No 400 errors in browser network tab

❌ **Bad** (indicates issues):
- Connection status stuck on "Connecting"
- Connection status shows "Connection Error"
- Transport stuck on "polling"
- 400 errors in browser network tab
- Frequent disconnects/reconnects

## Next Steps

If you find issues in this demo:
1. Note the exact error messages in both browser console and server logs
2. Check if the issue occurs on localhost vs LAN IP
3. Test with/without authentication headers
4. Compare with working Tdarr v2.17.01 (last known good version per issue #1189)
