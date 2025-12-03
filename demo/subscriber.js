#!/usr/bin/env node

import { connect, StringCodec } from 'nats';

const NATS_URL = process.env.NATS_URL || 'nats://localhost:4222';
const SUBJECT = process.env.SUBJECT || 'analytics.events';

const sc = StringCodec();

async function main() {
  console.log('🚀 Analytics Event Subscriber Starting...');
  console.log(`📡 Connecting to NATS: ${NATS_URL}`);
  console.log(`📬 Subscribing to: ${SUBJECT}`);

  try {
    // Connect to NATS
    const nc = await connect({ servers: NATS_URL });
    console.log('✅ Connected to NATS server');

    // Subscribe to analytics events
    const sub = nc.subscribe(SUBJECT);
    console.log(`✅ Subscribed to ${SUBJECT}`);
    console.log('👂 Listening for analytics events...\n');

    // Process messages
    let eventCount = 0;
    for await (const msg of sub) {
      eventCount++;
      try {
        const data = JSON.parse(sc.decode(msg.data));
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📊 Event #${eventCount} received`);
        console.log(`⏰ Time: ${new Date().toISOString()}`);
        console.log(`🎯 Event Type: ${data.eventType}`);
        console.log(`🧩 Component: ${data.componentType}`);
        if (data.componentId) {
          console.log(`🏷️  Component ID: ${data.componentId}`);
        }
        if (data.context && Object.keys(data.context).length > 0) {
          console.log(`🌍 Context:`, JSON.stringify(data.context, null, 2));
        }
        if (data.metadata && Object.keys(data.metadata).length > 0) {
          console.log(`📋 Metadata:`, JSON.stringify(data.metadata, null, 2));
        }
        console.log(`⏱️  Timestamp: ${new Date(data.timestamp).toISOString()}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      } catch (err) {
        console.error('❌ Error parsing event:', err.message);
      }
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down subscriber...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down subscriber...');
  process.exit(0);
});

main();
