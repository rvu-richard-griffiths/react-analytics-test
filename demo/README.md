# Real-Time Analytics Demo

This demo showcases the component library's analytics capabilities with real-time event streaming using NATS.

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│  Storybook  │────────▶│  NATS Bridge │────────▶│     NATS     │
│  (Browser)  │  HTTP   │  (HTTP→NATS) │  NATS   │   (Broker)   │
└─────────────┘         └──────────────┘         └──────────────┘
                                                          │
                                                          │ Subscribe
                                                          ▼
                                                  ┌──────────────┐
                                                  │  Subscriber  │
                                                  │ (Console Log)│
                                                  └──────────────┘
```

## Components

### NATS Server
- **Image**: `nats:2.10-alpine`
- **Ports**: 
  - 4222: Client connections
  - 8222: HTTP monitoring dashboard
  - 6222: Cluster routing
- **Features**: JetStream enabled for persistent streams

### NATS Bridge
- **Purpose**: HTTP→NATS gateway for browser clients
- **Port**: 3001
- **Endpoints**:
  - `POST /analytics` - Publish events
  - `GET /analytics/recent` - Get recent events
  - `GET /health` - Health check

### Analytics Subscriber
- **Purpose**: Real-time event viewer
- **Output**: Console logs showing all analytics events
- **View logs**: `task demo-logs`

## Quick Start

### 1. Start the Demo

```bash
task demo-up
```

This starts:
- ✅ NATS server on port 4222
- ✅ HTTP bridge on port 3001
- ✅ Event subscriber (logging to console)

### 2. Start Storybook

```bash
npm run storybook
```

Or start both together:

```bash
task demo-dev
```

### 3. View Events

Watch events in real-time:

```bash
task demo-logs
```

You'll see output like:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Event #1 received
⏰ Time: 2025-12-03T12:34:56.789Z
🎯 Event Type: button_click
🧩 Component: button
🏷️  Component ID: submit-button
📋 Metadata: {
  "variant": "primary",
  "formName": "contact"
}
⏱️  Timestamp: 2025-12-03T12:34:56.789Z
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Interact in Storybook

1. Open http://localhost:6006
2. Navigate to any component story
3. Interact with components (click buttons, type in inputs, etc.)
4. Watch events appear in real-time in the subscriber logs!

## Testing the Integration

### Test with curl

```bash
# Send a test event
curl -X POST http://localhost:3001/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "test_event",
    "componentType": "test",
    "componentId": "test-1",
    "metadata": { "source": "curl" },
    "timestamp": 1701612345678
  }'

# Get recent events
curl http://localhost:3001/analytics/recent

# Check health
curl http://localhost:3001/health
```

### Monitor NATS

Visit the NATS monitoring dashboard:
```
http://localhost:8222
```

Available endpoints:
- `/varz` - Server info
- `/connz` - Connection info
- `/subsz` - Subscription info

## Task Commands

| Command | Description |
|---------|-------------|
| `task demo-up` | Start all containers |
| `task demo-down` | Stop all containers |
| `task demo-logs` | View subscriber logs (events) |
| `task demo-logs-all` | View all container logs |
| `task demo-restart` | Restart the demo |
| `task demo-build` | Rebuild containers |
| `task demo-status` | Check container status |
| `task demo-dev` | Start demo + Storybook |

## How It Works

### 1. Component Interaction
When you interact with a component in Storybook (e.g., click a button):

```tsx
<Button 
  analyticsId="submit-button"
  analyticsMetadata={{ formName: 'contact' }}
  onClick={handleClick}
>
  Submit
</Button>
```

### 2. Event Generation
The component generates an analytics event:

```typescript
{
  eventType: "button_click",
  componentType: "button",
  componentId: "submit-button",
  metadata: { formName: "contact" },
  timestamp: 1701612345678
}
```

### 3. HTTP Bridge
The NATS adapter sends the event to the bridge via HTTP:

```typescript
POST http://localhost:3001/analytics
Content-Type: application/json

{ ...event }
```

### 4. NATS Publish
The bridge publishes to NATS subject `analytics.events`

### 5. Subscriber Receives
The subscriber prints the event to console in real-time

## Development

### Run Subscriber Locally

```bash
cd demo
npm install
NATS_URL=nats://localhost:4222 node subscriber.js
```

### Run Bridge Locally

```bash
cd demo
npm install
NATS_URL=nats://localhost:4222 PORT=3001 node bridge.js
```

## Troubleshooting

### Bridge not connecting?

```bash
# Check if NATS is running
docker ps | grep nats

# Check NATS health
curl http://localhost:8222/healthz

# View bridge logs
docker logs react-analytics-bridge
```

### No events appearing?

1. Check browser console for errors
2. Verify bridge is running: `curl http://localhost:3001/health`
3. Check subscriber logs: `task demo-logs`
4. Ensure Storybook is using the NATS adapter

### Reset everything

```bash
task demo-down
docker-compose rm -f
task demo-build
task demo-up
```

## Production Considerations

This demo is designed for development and demonstrations. For production:

1. **Security**: Add authentication to the bridge
2. **TLS**: Use HTTPS and NATS TLS
3. **Rate Limiting**: Add rate limiting to the bridge
4. **Persistence**: Configure JetStream for persistent streams
5. **Monitoring**: Add proper monitoring and alerting
6. **Scaling**: Use NATS cluster for high availability

## Next Steps

- Add a web dashboard to visualize events
- Store events in a time-series database
- Create aggregation pipelines
- Build analytics dashboards
- Export to external analytics platforms
