#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import { connect, StringCodec } from 'nats';

const NATS_URL = process.env.NATS_URL || 'nats://localhost:4222';
const PORT = process.env.PORT || 3001;
const SUBJECT = process.env.SUBJECT || 'analytics.events';

const app = express();
const sc = StringCodec();

let natsConnection = null;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    nats: natsConnection ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Publish analytics event
app.post('/analytics', async (req, res) => {
  if (!natsConnection) {
    return res.status(503).json({ error: 'NATS not connected' });
  }

  try {
    const event = req.body;
    
    // Validate event structure
    if (!event.eventType || !event.componentType) {
      return res.status(400).json({ 
        error: 'Invalid event structure. Required: eventType, componentType' 
      });
    }

    // Add server timestamp if not present
    if (!event.timestamp) {
      event.timestamp = Date.now();
    }

    // Publish to NATS
    natsConnection.publish(SUBJECT, sc.encode(JSON.stringify(event)));
    
    console.log(`📤 Published: ${event.eventType} from ${event.componentType}`);
    
    res.json({ 
      success: true, 
      message: 'Event published to NATS',
      event: event
    });
  } catch (err) {
    console.error('❌ Error publishing event:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get recent events (optional - for demo UI)
const recentEvents = [];
const MAX_RECENT_EVENTS = 100;

app.get('/analytics/recent', (req, res) => {
  res.json({ events: recentEvents });
});

// Subscribe to events to maintain recent list
async function subscribeToEvents() {
  if (!natsConnection) return;

  const sub = natsConnection.subscribe(SUBJECT);
  console.log(`📬 Subscribed to ${SUBJECT} for recent events tracking`);

  for await (const msg of sub) {
    try {
      const event = JSON.parse(sc.decode(msg.data));
      recentEvents.unshift(event);
      
      // Keep only recent events
      if (recentEvents.length > MAX_RECENT_EVENTS) {
        recentEvents.pop();
      }
    } catch (err) {
      console.error('Error processing event:', err);
    }
  }
}

// Connect to NATS
async function connectToNATS() {
  try {
    console.log(`📡 Connecting to NATS: ${NATS_URL}`);
    natsConnection = await connect({ servers: NATS_URL });
    console.log('✅ Connected to NATS server');
    
    // Subscribe to track recent events
    subscribeToEvents();
  } catch (err) {
    console.error('❌ Failed to connect to NATS:', err.message);
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(connectToNATS, 5000);
  }
}

// Start server
app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🌉 NATS Bridge Server Started');
  console.log(`🚀 Listening on port ${PORT}`);
  console.log(`📬 Publishing to subject: ${SUBJECT}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('Available endpoints:');
  console.log(`  POST   http://localhost:${PORT}/analytics`);
  console.log(`  GET    http://localhost:${PORT}/analytics/recent`);
  console.log(`  GET    http://localhost:${PORT}/health\n`);
  
  connectToNATS();
});

// Handle shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down bridge...');
  if (natsConnection) {
    await natsConnection.close();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n👋 Shutting down bridge...');
  if (natsConnection) {
    await natsConnection.close();
  }
  process.exit(0);
});
